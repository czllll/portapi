package work.dirtsai.portapiproxy.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import work.dirtsai.portapiproxy.service.StandardOpenAIRequestService;
import work.dirtsai.portapiproxy.utils.HttpUtils;

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

    @PostMapping("/chat/completions")
    public void proxyRequest(@org.springframework.web.bind.annotation.RequestBody String requestBody,
                             @RequestHeader Map<String, String> headers,
                             HttpServletRequest servletRequest,
                             HttpServletResponse servletResponse) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootBody = objectMapper.readTree(requestBody);

        boolean isStream = rootBody.path("stream").asBoolean();
        String model = rootBody.path("model").asText();
        String apikey = standardOpenAIRequestService.getApiKeyByModelName(model);

        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(openaiApiUrl + "/chat/completions")
                .post(RequestBody.create(requestBody, okhttp3.MediaType.parse(MediaType.APPLICATION_JSON_VALUE)))
                .addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apikey)
                .build();

        if (!isStream) {
            Response response = client.newCall(request).execute();
            String responseBody = response.body().string();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(responseBody);
            Integer totalTokens = rootNode.path("usage").path("total_tokens").asInt();

            boolean updateQuota = standardOpenAIRequestService.updateTokenQuota(
                    headers.get("authorization").substring(7),
                    totalTokens
            );

            if (!updateQuota) {
                throw new RuntimeException("Update token quota failed");
            }

            servletResponse.setContentType(response.header("Content-Type"));
            servletResponse.setCharacterEncoding("UTF-8");
            servletResponse.getWriter().write(responseBody);

        } else {
            AsyncContext asyncContext = servletRequest.startAsync();
            asyncContext.setTimeout(60000);

            servletResponse.setContentType("text/event-stream");
            servletResponse.setCharacterEncoding("UTF-8");

            ServletOutputStream output = servletResponse.getOutputStream();

            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onResponse(Call call, Response response) {
                    try (ResponseBody responseBody = response.body()) {
                        BufferedReader reader = new BufferedReader(
                                new InputStreamReader(responseBody.byteStream())
                        );

                        String line;
                        while ((line = reader.readLine()) != null) {
                            output.write((line + "\n").getBytes(StandardCharsets.UTF_8));
                            if (line.isEmpty()) {
                                output.flush();
                            }
                        }
                    } catch (Exception e) {
                        log.error("Error processing stream", e);
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
                    asyncContext.complete();
                }
            });
        }
    }
}