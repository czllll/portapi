package work.dirtsai.portapiadmin.portapiproxy.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import work.dirtsai.portapiadmin.portapiproxy.utils.HttpUtils;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@Slf4j
public class StandarOpenAIReq {

    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String openaiApiUrl;

    @Autowired
    private HttpUtils httpUtils;

    @PostMapping("/chat/completions")
    public ResponseEntity<String> proxyRequest(@RequestBody String requestBody) {
        try {
            String apiKey = "x";

            // 构建headers
            Map<String, String> headers = new HashMap<>();
            headers.put("Authorization", "Bearer " + apiKey);
            headers.put("Content-Type", "application/json");

            // 发送请求
            String response = httpUtils.post(
                    openaiApiUrl + "/chat/completions",
                    requestBody,
                    headers
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Proxy request failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Proxy request failed: " + e.getMessage());
        }
    }

}
