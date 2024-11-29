package work.dirtsai.portapiadmin.client;

import okhttp3.*;
import okhttp3.logging.HttpLoggingInterceptor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class ApiClient {
    private final OkHttpClient client;
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    public ApiClient() {
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        this.client = new OkHttpClient.Builder()
                .addInterceptor(logging)
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
    }

    public Response execute(String url, String method, Map<String, String> headers, String requestBody) throws IOException {
        Request.Builder requestBuilder = new Request.Builder()
                .url(url);

        if (headers != null) {
            headers.forEach(requestBuilder::addHeader);
        }

        switch (method.toUpperCase()) {
            case "GET":
                requestBuilder.get();
                break;
            case "POST":
                RequestBody body = RequestBody.create(requestBody, JSON);
                requestBuilder.post(body);
                break;
            case "PUT":
                RequestBody putBody = RequestBody.create(requestBody, JSON);
                requestBuilder.put(putBody);
                break;
            case "DELETE":
                requestBuilder.delete();
                break;
            default:
                throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        }

        return client.newCall(requestBuilder.build()).execute();
    }

    public String executeForString(String url, String method, Map<String, String> headers, String requestBody) throws IOException {
        try (Response response = execute(url, method, headers, requestBody)) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected response code: " + response);
            }
            ResponseBody responseBody = response.body();
            return responseBody != null ? responseBody.string() : null;
        }
    }

    // 便捷方法
    public String get(String url, Map<String, String> headers) throws IOException {
        return executeForString(url, "GET", headers, null);
    }

    public String post(String url, Map<String, String> headers, String requestBody) throws IOException {
        return executeForString(url, "POST", headers, requestBody);
    }

    public String put(String url, Map<String, String> headers, String requestBody) throws IOException {
        return executeForString(url, "PUT", headers, requestBody);
    }

    public String delete(String url, Map<String, String> headers) throws IOException {
        return executeForString(url, "DELETE", headers, null);
    }
}