package work.dirtsai.portapiadmin.portapiproxy.config;

import okhttp3.ConnectionPool;
import okhttp3.OkHttpClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class OkHttpConfig {

    @Bean
    public OkHttpClient okHttpClient() {
        return new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)    // 连接超时
                .readTimeout(30, TimeUnit.SECONDS)       // 读超时
                .writeTimeout(30, TimeUnit.SECONDS)      // 写超时
                .retryOnConnectionFailure(true)          // 是否自动重连
                .connectionPool(new ConnectionPool(200, 5, TimeUnit.MINUTES))  // 连接池
                .build();
    }
}
