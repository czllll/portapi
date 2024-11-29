package work.dirtsai.portapiadmin.filter;

import jakarta.annotation.Resource;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

@Configuration
public class FilterConfig {


    public FilterRegistrationBean<GatewayAuthFilter> gatewayAuthFilter() {
        FilterRegistrationBean<GatewayAuthFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new GatewayAuthFilter());
        registrationBean.addUrlPatterns("/*");
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registrationBean;
    }
}