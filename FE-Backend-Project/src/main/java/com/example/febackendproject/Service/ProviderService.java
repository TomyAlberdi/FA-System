package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Repository.ProviderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProviderService {
    
    private final ProviderRepository providerRepository;
    
    public List<Provider> list() {
        return providerRepository.findAll();
    }
    
    public Optional<Provider> findById(Long id) {
        return providerRepository.findById(id);
    }
    
    public Optional<Provider> findByName(String name) {
        return providerRepository.findByName(name);
    }
    
    public Provider save(String name) {
        Provider provider = new Provider();
        provider.setName(name);
        return providerRepository.save(provider);
    }
    
    public void deleteById(Long id) {
        providerRepository.deleteById(id);
    }
    
}
