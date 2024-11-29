package work.dirtsai.portapiadmin.filter;

import jakarta.annotation.Resource;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.HmacUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ReactiveRedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class GatewayAuthFilter implements Filter {

    private static final long FIVE_MINUTES = 5 * 60 * 1000;

    @Value("${internal.secret}")
    private String secret;

    // redisTemplate
    @Autowired
    private StringRedisTemplate redisTemplate;

    private static final String NONCE_PREFIX = "internal:nonce:";
    private static final long EXPIRE_TIME = 300; // 5分钟


    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        //验证签名
        if (!verifyInternalAuth(httpRequest)) {
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(request, response);
    }

    /**
     * 验证签名
     */
    private boolean verifyInternalAuth(HttpServletRequest request) {
        try {
            String sign = request.getHeader("X-Gateway-Sign");
            String timestamp = request.getHeader("X-Gateway-Timestamp");
            String nonce = request.getHeader("X-Gateway-Nonce");
            String path = request.getRequestURI();

            // 检查参数
            if (StringUtils.isAnyBlank(sign, timestamp, nonce)) {
                return false;
            }

            // 检查时间戳
            long reqTimestamp = Long.parseLong(timestamp);
            long now = System.currentTimeMillis();
            if (Math.abs(now - reqTimestamp) > FIVE_MINUTES) {
                return false;
            }

            // 检查随机数
            String nonceKey = NONCE_PREFIX + nonce;
            if (Boolean.TRUE.equals(redisTemplate.hasKey(nonceKey))) {
                return false;
            }
            // 保存随机数，防止重放攻击
            redisTemplate.opsForValue().set(nonceKey, "1", EXPIRE_TIME, TimeUnit.SECONDS);


            // 检查签名
            String content = timestamp + ":" + nonce + ":" + path;
            String expectedSign = HmacUtils.hmacSha256Hex(secret, content);
            return sign.equals(expectedSign);


        } catch (Exception e) {
            log.error("Internal auth failed", e);
            return false;
        }
    }
}

