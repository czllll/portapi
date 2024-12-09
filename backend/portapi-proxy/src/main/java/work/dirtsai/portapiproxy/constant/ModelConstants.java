package work.dirtsai.portapiproxy.constant;

public class ModelConstants {
    private static final String GOOGLE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
    private static final String OPENAI_BASE_URL = "https://api.openai.com/v1";

    public static String getEndpointUrl(String model, String apiKey, boolean isStream) {
        if (model.startsWith("gemini-")) {
            String endpoint = isStream ? ":streamGenerateContent" : ":generateContent";
            return GOOGLE_BASE_URL + "/models/" + model + endpoint + "?key=" + apiKey;
        }
        return OPENAI_BASE_URL + "/chat/completions";
    }

    public static String getModelCompany(String model) {
        if (model.startsWith("gemini-")) {
            return "google";
        }
        return "openai";
    }

    public static boolean needsAuthHeader(String model) {
        // Google AI API 使用 URL 参数进行认证，不需要认证头
        return !model.startsWith("gemini-");
    }
}