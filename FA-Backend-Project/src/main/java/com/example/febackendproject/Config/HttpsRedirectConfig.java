package com.example.febackendproject.Config;
import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

public class HttpsRedirectConfig {
    
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> redirectHttpToHttps() {
        return factory -> factory.addAdditionalTomcatConnectors(httpConnector());
    }
    
    private Connector httpConnector() {
        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
        connector.setScheme("http");
        connector.setPort(8080); // Port for HTTP
        connector.setSecure(false);
        connector.setRedirectPort(8443); // Redirect to HTTPS port
        return connector;
    }
}
