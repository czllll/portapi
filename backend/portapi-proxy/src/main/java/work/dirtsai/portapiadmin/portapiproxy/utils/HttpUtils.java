package work.dirtsai.portapiadmin.portapiproxy.utils;

import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;


@Component
@Slf4j
public class HttpUtils {

    @Autowired
    private OkHttpClient okHttpClient;

    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    // GET请求
    public String get(String url, Map<String, String> headers) throws IOException {
        Request.Builder builder = new Request.Builder().url(url);
        // 添加headers
        if (headers != null) {
            headers.forEach(builder::addHeader);
        }

        try (Response response = okHttpClient.newCall(builder.build()).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            return response.body().string();
        }
    }

    // POST请求
    public String post(String url, String json, Map<String, String> headers) throws IOException {
        RequestBody body = RequestBody.create(json, JSON);
        Request.Builder builder = new Request.Builder()
                .url(url)
                .post(body);

        // 添加headers
        if (headers != null) {
            headers.forEach(builder::addHeader);
        }

        try (Response response = okHttpClient.newCall(builder.build()).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }
            return response.body().string();
        }
    }
}