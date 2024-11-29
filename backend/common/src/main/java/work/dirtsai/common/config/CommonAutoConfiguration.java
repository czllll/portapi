package work.dirtsai.common.config;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@AutoConfiguration
@ComponentScan("work.dirtsai.common.utils")
public class CommonAutoConfiguration {
}