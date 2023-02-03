package io.openvidu.server.config;

import org.springframework.context.EnvironmentAware;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:properties/env.properties")
public class PropertyConfig implements EnvironmentAware {

    private static Environment env;

    public static String getProperty(String key) {
        return env.getProperty(key);
    }

    @Override
    public void setEnvironment(Environment env) {
        PropertyConfig.env = env;
    }
}
