package work.dirtsai.portapiproxy.utils;

import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.function.Consumer;

@Component
@Slf4j
public class HttpUtils {

    @Autowired
    private OkHttpClient okHttpClient;

    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    public void postStream(
            String url,
            String json,
            Map<String, String> headers,
            Consumer<String> chunkConsumer,
            Runnable completionCallback
    ) throws IOException, InterruptedException {
        RequestBody body = RequestBody.create(json, JSON);
        Request.Builder builder = new Request.Builder()
                .url(url)
                .post(body);

        // 添加headers
        if (headers != null) {
            headers.forEach(builder::addHeader);
        }

        okHttpClient.newCall(builder.build()).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                log.error("Streaming request failed", e);
                completionCallback.run();
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) {
                    log.error("Unsuccessful response: {}", response);
                    completionCallback.run();
                    return;
                }

                try (ResponseBody responseBody = response.body()) {
                    if (responseBody == null) {
                        log.error("Response body is null");
                        return;
                    }

                    // 使用 BufferedSource 逐行读取
                    okio.BufferedSource source = responseBody.source();
                    while (!source.exhausted()) {
                        String line = source.readUtf8Line();
                        if (line != null && !line.isEmpty() && line.startsWith("data: ")) {
                            // 移除 "data: " 前缀
                            String chunk = line.substring(6);

                            // 不处理 [DONE] 标记
                            if (!"[DONE]".equals(chunk)) {
                                chunkConsumer.accept(chunk);
                            }
                        }
                    }
                } catch (Exception e) {
                    log.error("Error processing streaming response", e);
                } finally {
                    // 确保完成回调被调用
                    completionCallback.run();
                }
            }
        });
    }
    // 保留原有的 post 方法
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