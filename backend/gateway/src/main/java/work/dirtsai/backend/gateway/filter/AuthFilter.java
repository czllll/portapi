package work.dirtsai.backend.gateway.filter;

import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import work.dirtsai.backend.gateway.service.InternalAuthService;

/**
 * 添加内部认证信息
 */
@Component
public class AuthFilter implements GlobalFilter {

    @Autowired
    private InternalAuthService internalAuthService;


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest req = exchange.getRequest();
        ServerHttpRequest.Builder builder = req.mutate();

        // JWT认证

        // 添加内部认证信息
        internalAuthService.addInternalAuth(req, builder);
        ServerHttpRequest newRequest = builder.build();
        return chain.filter(exchange.mutate().request(newRequest).build());

    }
}
