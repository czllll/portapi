package work.dirtsai.backend.gateway.filter;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import work.dirtsai.backend.gateway.service.InternalAuthService;
import work.dirtsai.common.utils.JwtUtils;

/**
 * 添加内部认证信息
 */
@Slf4j
@Component
public class AuthFilter implements GlobalFilter {

    @Autowired
    private InternalAuthService internalAuthService;

    @Resource
    private JwtUtils jwtUtils;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest req = exchange.getRequest();
        ServerHttpRequest.Builder builder = req.mutate();
        String path = req.getURI().getPath();
        // 登录注册接口不需要认证
        if ((!((path.contains("/login")) || path.contains("/register"))) && (path.contains("/api"))) {
            // JWT认证
            String reqToken = req.getHeaders().getFirst("Authorization");
            // token结构验证
            if (!(reqToken != null && reqToken.startsWith("Bearer "))) {
                throw new RuntimeException("Token does exist or token structure error");
            }
            // token签名验证
            String token = reqToken.substring(7);
            if (!jwtUtils.validateToken(token)) {
                throw new RuntimeException("Token signature error");
            }
        }

        // 添加内部认证信息
        internalAuthService.addInternalAuth(req, builder);
        ServerHttpRequest newRequest = builder.build();
        return chain.filter(exchange.mutate().request(newRequest).build());

    }
}
