package work.dirtsai.backend.gateway.service;

import jakarta.annotation.Resource;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ReactiveRedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.UUID;

@Component
public class InternalAuthService {

    @Value("${internal.secret}")
    private String secret;

    @Autowired
    private StringRedisTemplate redisTemplate;


    /**
     * 添加内部认证信息
     * @param request
     * @param builder
     */

    public void addInternalAuth(ServerHttpRequest request, ServerHttpRequest.Builder builder) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String nonce = UUID.randomUUID().toString();
        //将nonce存入redis，设置过期时间为5分钟
        //redisTemplate.opsForValue().set("internal:nonce:" + nonce, nonce, Duration.ofMinutes(5));
        String path = request.getURI().getPath();

        // 计算签名
        String signature = generateSign(timestamp, nonce, path);

        // 添加头部
        builder.header("X-Gateway-Sign", signature)
                .header("X-Gateway-Timestamp", timestamp)
                .header("X-Gateway-Nonce", nonce);
    }

    /**
     * 生成签名
     * @param timestamp 时间戳
     * @param nonce 随机数
     * @param path 请求路径
     * @return
     */
    private String generateSign(String timestamp, String nonce, String path) {
        String content = timestamp + ":" + nonce + ":" + path;
        return HmacUtils.hmacSha256Hex(secret, content);
    }
}
