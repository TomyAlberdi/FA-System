package com.example.febackendproject.Security;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class JwtAuthenticationFilter  extends OncePerRequestFilter {
    
    private final JWTVerifier verifier;
    
    public JwtAuthenticationFilter(JWTVerifier verifier) {
        this.verifier = verifier;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        String token = request.getHeader("Authorization");
        logger.debug("Token: " + token);
        if (token != null && token.startsWith("Bearer ")) {
            try {
                DecodedJWT jwt = verifier.verify(token.substring(7));
                // Extract roles from token
                List<GrantedAuthority> authorities = jwt.getClaim("roles").asList(Map.class).stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.get("key").toString()))
                        .collect(Collectors.toList());
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(jwt.getSubject(), null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JWTVerificationException e) {
                logger.error("JWT verification failed", e);
                SecurityContextHolder.clearContext();
            }
        }
        chain.doFilter(request, response);
    }
    
}