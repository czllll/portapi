package work.dirtsai.portapiproxy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;

@EnableFeignClients
@SpringBootApplication
@ComponentScan(basePackages = {"work.dirtsai.portapiproxy", "work.dirtsai.common"})
public class PortapiProxyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortapiProxyApplication.class, args);
    }

}
