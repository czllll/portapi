package work.dirtsai.portapiproxy.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;    // FULL级别会记录请求和响应的头信息、正文及元数据
    }
}