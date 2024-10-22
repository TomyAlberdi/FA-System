package com.example.febackendproject.Security;

import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.jwt.interfaces.RSAKeyProvider;

import java.net.URL;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

public class JwksService implements RSAKeyProvider {
    
    private final JwkProvider provider;
    
    public JwksService(String jwksUrl) throws Exception {
        // Using JwkProviderBuilder from jwks-rsa package
        this.provider = new JwkProviderBuilder(new URL(jwksUrl)).build();
    }
    
    @Override
    public RSAPublicKey getPublicKeyById(String keyId) {
        try {
            return (RSAPublicKey) provider.get(keyId).getPublicKey();
        } catch (JwkException e) {
            throw new RuntimeException("Could not find the public key with keyId: " + keyId, e);
        }
    }
    
    @Override
    public RSAPrivateKey getPrivateKey() {
        return null;  // Private key handling is not required
    }
    
    @Override
    public String getPrivateKeyId() {
        return null;
    }
}
