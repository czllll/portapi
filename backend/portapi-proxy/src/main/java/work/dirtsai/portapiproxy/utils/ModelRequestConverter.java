package work.dirtsai.portapiproxy.utils;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.UUID;

public class ModelRequestConverter {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static String convertToGoogleFormat(String openaiRequest, String googleModel) throws Exception {
        JsonNode root = objectMapper.readTree(openaiRequest);
        ObjectNode googleRequest = objectMapper.createObjectNode();

        // 创建 contents 数组
        ArrayNode contents = googleRequest.putArray("contents");
        ObjectNode content = contents.addObject();
        ArrayNode parts = content.putArray("parts");

        // 只获取最后一条用户消息
        ArrayNode messages = (ArrayNode) root.get("messages");
        for (JsonNode message : messages) {
            if ("user".equals(message.get("role").asText())) {
                ObjectNode part = parts.addObject();
                part.put("text", message.get("content").asText());
            }
        }

        return googleRequest.toString();
    }

    public static String convertFromGoogleResponse(String googleResponse, boolean isStream, String model) throws Exception {
        if (isStream) {
            return convertGoogleStreamResponse(googleResponse, model);
        }

        JsonNode root = objectMapper.readTree(googleResponse);
        ObjectNode openaiResponse = objectMapper.createObjectNode();

        // 设置基本字段
        openaiResponse.put("model", root.get("modelVersion")); // 或映射的模型名
        openaiResponse.put("object", "chat.completion");

        // 转换选择内容
        ArrayNode choices = openaiResponse.putArray("choices");
        ObjectNode choice = choices.addObject();

        JsonNode googleContent = root.path("contents").path(0);
        choice.put("index", 0);

        ObjectNode message = choice.putObject("message");
        message.put("role", "assistant");
        message.put("content", googleContent.path("parts").path(0).asText());

        choice.put("finish_reason", "stop");

        // 添加用量信息
        ObjectNode usage = openaiResponse.putObject("usage");
        usage.put("prompt_tokens", root.path("usageMetadata").path("promptTokenCount").asInt());
        usage.put("completion_tokens", root.path("usageMetadata").path("candidatesTokenCount").asInt());
        usage.put("total_tokens",
                root.path("usageMetadata").path("promptTokenCount").asInt() +
                        root.path("usageMetadata").path("candidatesTokenCount").asInt());

        return openaiResponse.toString();
    }

    private static String convertGoogleStreamResponse(String googleChunk, String model) throws Exception {
        String cleanedChunk = googleChunk;
        if (googleChunk.startsWith("data: ")) {
            cleanedChunk = googleChunk.substring("data: ".length());
        }

        JsonNode root = objectMapper.readTree(cleanedChunk);
        ObjectNode openaiChunk = objectMapper.createObjectNode();

        openaiChunk.put("id", UUID.randomUUID().toString());
        openaiChunk.put("object", "chat.completion.chunk");
        openaiChunk.put("created", System.currentTimeMillis() / 1000);
        openaiChunk.put("model", model);

        ArrayNode choices = openaiChunk.putArray("choices");
        ObjectNode choice = choices.addObject();
        choice.put("index", 0);
        choice.putNull("finish_reason");

        ObjectNode delta = choice.putObject("delta");

        if (root.has("candidates")) {
            JsonNode candidate = root.path("candidates").path(0);
            JsonNode contentNode = candidate.path("content").path("parts").path(0).path("text");
            if (!contentNode.isMissingNode()) {
                delta.put("content", contentNode.asText());
                delta.put("role", "assistant");
            } else {
                delta.putObject(null);
            }
        }

        if (root.has("usageMetadata") && root.path("usageMetadata").has("candidatesTokenCount")) {
            ObjectNode usageMetadata = (ObjectNode) root.get("usageMetadata");
            int promptTokens = usageMetadata.path("promptTokenCount").asInt();
            int completionTokens = usageMetadata.path("candidatesTokenCount").asInt();

            choice.put("finish_reason", "stop");

            ObjectNode usage = openaiChunk.putObject("usage");
            usage.put("prompt_tokens", promptTokens);
            usage.put("completion_tokens", completionTokens);
            usage.put("total_tokens", promptTokens + completionTokens);

        }

        return "data: " + openaiChunk.toString() + "\n\n";
    }
}