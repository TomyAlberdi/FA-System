package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Repository.ProductRepository;
import com.example.febackendproject.Repository.ProviderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProviderService {
    
    private final ProviderRepository providerRepository;
    private final ProductRepository productRepository;
    
    public List<Provider> list() {
        return providerRepository.findAll();
    }
    
    public Optional<Provider> findById(Long id) {
        return providerRepository.findById(id);
    }
    
    public Optional<Provider> findByName(String name) {
        return providerRepository.findByName(name);
    }
    
    public void updateById(Provider provider) {
        providerRepository.updateById(provider.getId(), provider.getName(), provider.getLocality(), provider.getAddress(), provider.getPhone(), provider.getEmail(), provider.getCuit());
    }
    
    public boolean existsById(Long id) {
        return providerRepository.existsById(id);
    }
    
    public Provider save(Provider provider) {
        return providerRepository.save(provider);
    }
    
    public List<Long> getIdByProvider(Long providerId) {
        return productRepository.getIdByProvider(providerId);
    }
    
    public void deleteById(Long id) {
        providerRepository.deleteById(id);
    }
    
}
