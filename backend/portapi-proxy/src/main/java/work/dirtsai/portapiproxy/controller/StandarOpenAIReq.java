package work.dirtsai.portapiproxy.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.annotation.Resource;
import jakarta.servlet.AsyncContext;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.http.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.common.common.ApiCallDTO;
import work.dirtsai.portapiproxy.constant.ModelConstants;
import work.dirtsai.portapiproxy.service.StandardOpenAIRequestService;
import work.dirtsai.portapiproxy.utils.HttpUtils;
import work.dirtsai.portapiproxy.utils.ModelRequestConverter;

import java.util.concurrent.atomic.AtomicBoolean;
import java.io.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;



@RestController
@RequestMapping("/")
@Slf4j
@ServletComponentScan
public class StandarOpenAIReq {

    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String openaiApiUrl;

    @Autowired
    private HttpUtils httpUtils;

    @Resource
    private StandardOpenAIRequestService standardOpenAIRequestService;

    @Resource
    private OkHttpClient client;

    @PostMapping("/chat/completions")
    public void proxyRequest(@org.springframework.web.bind.annotation.RequestBody String requestBody,
                             @RequestHeader Map<String, String> headers,
                             HttpServletRequest servletRequest,
                             HttpServletResponse servletResponse) throws Exception {

        long startTime = System.currentTimeMillis();
        String tokenNumber = headers.get("authorization").substring(7);

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootBody = objectMapper.readTree(requestBody);

        boolean isStream = rootBody.path("stream").asBoolean();
        String model = rootBody.path("model").asText();

        // 获取模型公司和apikey
        String modelCompany = ModelConstants.getModelCompany(model);
        String apikey = standardOpenAIRequestService.getApiKeyByModelName(model);

        // 转换请求格式
        String transformedRequest = requestBody;
        if ("google".equals(modelCompany)) {
            transformedRequest = ModelRequestConverter.convertToGoogleFormat(requestBody, model);
        } else if (isStream) {
            // OpenAI的流式请求处理
            ObjectNode modifiedBody = (ObjectNode) rootBody;
            ObjectNode streamOptions = objectMapper.createObjectNode();
            streamOptions.put("include_usage", true);
            modifiedBody.set("stream_options", streamOptions);
            transformedRequest = modifiedBody.toString();
        }

        log.info("OkHttp Configuration - Read Timeout: {}s, Connect Timeout: {}s, Write Timeout: {}s",
                client.readTimeoutMillis() / 1000,
                client.connectTimeoutMillis() / 1000,
                client.writeTimeoutMillis() / 1000);

        // 在 proxyRequest 方法中
        Request.Builder requestBuilder = new Request.Builder()
                .url(ModelConstants.getEndpointUrl(model, apikey, isStream))
                .post(RequestBody.create(transformedRequest, okhttp3.MediaType.parse(MediaType.APPLICATION_JSON_VALUE)));
        // 只有 OpenAI 等需要认证头的 API 才添加
        if (ModelConstants.needsAuthHeader(model)) {
            requestBuilder.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apikey);
        }
        // google 流式传输添加 alt 参数
        if (isStream && "google".equals(modelCompany)) {
            requestBuilder.url(requestBuilder.build().url().newBuilder().addQueryParameter("alt", "sse").build());
        }

        Request request = requestBuilder.build();

        try {
            if (!isStream) {
                // 非流式响应处理
                Response response = client.newCall(request).execute();
                String responseBody = response.body().string();

                // 转换响应格式
                if ("google".equals(modelCompany)) {
                    responseBody = ModelRequestConverter.convertFromGoogleResponse(responseBody, false, model);
                }

                ObjectMapper mapper = new ObjectMapper();
                JsonNode rootNode = mapper.readTree(responseBody);
                Integer totalTokens = rootNode.path("usage").path("total_tokens").asInt();

                boolean updateQuota = standardOpenAIRequestService.updateTokenQuota(tokenNumber, totalTokens);
                if (!updateQuota) {
                    throw new RuntimeException("Update token quota failed");
                }

                // 保存调用信息
                saveApiCall(model, tokenNumber, totalTokens, 1, startTime);

                servletResponse.setContentType(response.header("Content-Type"));
                servletResponse.setCharacterEncoding("UTF-8");
                servletResponse.getWriter().write(responseBody);

            } else {
                AsyncContext asyncContext = servletRequest.startAsync();
                asyncContext.setTimeout(360000);

                servletResponse.setContentType("text/event-stream");
                servletResponse.setCharacterEncoding("UTF-8");

                ServletOutputStream output = servletResponse.getOutputStream();
                AtomicBoolean usageProcessed = new AtomicBoolean(false);

                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onResponse(Call call, Response response) {
                        try (ResponseBody responseBody = response.body()) {
                            BufferedReader reader = new BufferedReader(
                                    new InputStreamReader(responseBody.byteStream())
                            );

                            String line;
                            while ((line = reader.readLine()) != null) {
                                // 转换流式响应格式
                                if ("google".equals(modelCompany)) {
                                    line = ModelRequestConverter.convertFromGoogleResponse(line, true, model);

                                }

                                output.write((line + "\n").getBytes(StandardCharsets.UTF_8));
                                if (line.isEmpty()) {
                                    output.flush();
                                }
                                if (!usageProcessed.get() && line.startsWith("data: ")) {
                                    String chunk = line.substring(6);
                                    try {
                                        if (!chunk.equals("[DONE]")) {
                                            JsonNode chunkNode = objectMapper.readTree(chunk);
                                            if (chunkNode.has("usage") && !chunkNode.get("usage").isNull()) {
                                                JsonNode usage = chunkNode.get("usage");
                                                Integer totalTokens = usage.get("total_tokens").asInt();
                                                boolean updateQuota = standardOpenAIRequestService.updateTokenQuota(tokenNumber, totalTokens);
                                                saveApiCall(model, tokenNumber, totalTokens, updateQuota ? 1 : 0, startTime);
                                                log.info("Token quota updated successfully, totalTokens: {}", totalTokens);
                                                usageProcessed.set(true);
                                            }
                                        }
                                    } catch (Exception e) {
                                        log.error("Error processing chunk: {}", chunk, e);
                                    }
                                }
                            }
                        } catch (Exception e) {
                            log.error("Error processing stream", e);
                            if (!usageProcessed.get()) {
                                saveApiCall(model, tokenNumber, 0, 0, startTime);
                            }
                        } finally {
                            try {
                                output.close();
                            } catch (IOException e) {
                                log.error("Error closing output stream", e);
                            }
                            asyncContext.complete();
                        }
                    }

                    @Override
                    public void onFailure(Call call, IOException e) {
                        log.error("Stream response error", e);
                        saveApiCall(model, tokenNumber, 0, 0, startTime);
                        asyncContext.complete();
                    }
                });
            }
        } catch (Exception e) {
            log.error("Error in proxy request", e);
            saveApiCall(model, tokenNumber, 0, 0, startTime);
            throw e;
        }
    }

    private void saveApiCall(String model, String tokenNumber, Integer usedTokens, Integer status, long startTime) {
        try {
            ApiCallDTO apiCallDTO = new ApiCallDTO();
            apiCallDTO.setCallModel(model);
            apiCallDTO.setTokenNumber(tokenNumber);
            apiCallDTO.setUsedToken(usedTokens);
            apiCallDTO.setStatus(status);
            apiCallDTO.setResponseTime((int) (System.currentTimeMillis() - startTime));
            standardOpenAIRequestService.saveApiCall(apiCallDTO);
        } catch (Exception e) {
            log.error("Error saving api call", e);
        }
    }
}