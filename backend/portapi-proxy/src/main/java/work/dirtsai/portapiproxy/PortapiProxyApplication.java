package work.dirtsai.portapiproxy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@SpringBootApplication
public class PortapiProxyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortapiProxyApplication.class, args);
    }

}
