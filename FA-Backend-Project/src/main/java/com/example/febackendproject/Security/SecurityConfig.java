package com.example.febackendproject.Security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Value("${kinde.jwks.url}")
    private String jwksUrl;
    
    @Value("${kinde.issuer}")
    private String issuer;
    
    @Value("${kinde.audience}")
    private String audience;
    
    @Bean
    public JWTVerifier jwtVerifier() throws Exception {
        JwksService jwksService = new JwksService(jwksUrl);
        Algorithm algorithm = Algorithm.RSA256(jwksService);
        return JWT.require(algorithm)
                .withIssuer(issuer)
                .withAudience(audience)
                .build();
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                //.authorizeHttpRequests(auth -> auth
                        // disable security for testing ignore otherwise
                        //.requestMatchers(HttpMethod.GET).permitAll()
                        //.anyRequest().hasAnyAuthority("ROLE_admin"))
                        //.anyRequest().authenticated())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .addFilterBefore(new JwtAuthenticationFilter(jwtVerifier()), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://fa-admin.online"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://fa-admin.online"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
    
}
