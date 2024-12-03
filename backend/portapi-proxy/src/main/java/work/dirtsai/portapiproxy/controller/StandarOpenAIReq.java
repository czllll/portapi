package work.dirtsai.portapiproxy.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import work.dirtsai.portapiproxy.entity.Model;
import work.dirtsai.portapiproxy.service.StandardOpenAIRequestService;
import work.dirtsai.portapiproxy.utils.HttpUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/")
@Slf4j
public class StandarOpenAIReq {

    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String openaiApiUrl;

    @Autowired
    private HttpUtils httpUtils;

    @Resource
    private StandardOpenAIRequestService standardOpenAIRequestService;

    @PostMapping("/chat/completions")
    public ResponseEntity<String> proxyRequest(@RequestBody String requestBody, @RequestHeader Map<String, String> headers) {
        try {
            // 解析请求体
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootBody = objectMapper.readTree(requestBody);
            // 获取请求体中的model
            String model = rootBody.path("model").asText();
            // 获取apikey

            String apikey = standardOpenAIRequestService.getApiKeyByModelName(model);

            // 构建headers
            Map<String, String> newHeaders = new HashMap<>();

            newHeaders.put(HttpHeaders.AUTHORIZATION, "Bearer " + apikey);
            newHeaders.put(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

            // 发送请求
            String response = httpUtils.post(
                    openaiApiUrl + "/chat/completions",
                    requestBody,
                    newHeaders
            );

            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);

            // 获取 total_tokens
            Integer totalTokens = rootNode.path("usage").path("total_tokens").asInt();
            // 更新令牌配额
            boolean updateQuota = standardOpenAIRequestService.updateTokenQuota(headers.get("authorization"), totalTokens);
            if (!updateQuota)
                throw new RuntimeException("Update token quota failed");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Proxy request failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Proxy request failed: " + e.getMessage());
        }
    }

}
