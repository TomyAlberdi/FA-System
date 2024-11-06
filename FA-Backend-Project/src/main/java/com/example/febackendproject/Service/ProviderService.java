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
        List<Provider> providers = providerRepository.findAll();
        for (Provider provider : providers) {
            provider.setProductsAmount(productRepository.getProductAmountByProvider(provider.getId()));
        }
        return providers;
    }
    
    public Optional<Provider> findById(Long id) {
        Optional<Provider> provider = providerRepository.findById(id);
        provider.ifPresent(value -> value.setProductsAmount(productRepository.getProductAmountByProvider(id)));
        return provider;
    }
    
    public Optional<Provider> findByName(String name) {
        Optional<Provider> provider = providerRepository.findByName(name);
        provider.ifPresent(value -> value.setProductsAmount(productRepository.getProductAmountByProvider(provider.get().getId())));
        return provider;
    }
    
    public void updateById(Provider provider) {
        providerRepository.updateById(provider.getId(), provider.getName(), provider.getLocality(), provider.getAddress(), provider.getPhone(), provider.getEmail(), provider.getCuit());
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
