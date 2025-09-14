package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.Provider.CreateProviderDTO;
import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Exception.ExistingAttributeException;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Mapper.ProviderMapper;
import com.example.febackendproject.Repository.ProductRepository;
import com.example.febackendproject.Repository.ProviderRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    
    public List<Provider> listTopFive() {
        return providerRepository.listTopFiveByProductAmount();
    }
    
    public Provider findById(Long id) {
        Optional<Provider> provider = providerRepository.findById(id);
        if (provider.isEmpty()) {
            throw new ResourceNotFoundException("Proveedor con ID " + id + " no encontrado.");
        }
        return provider.get();
    }
    
    public void assertProviderExists(Long id) {
        if (providerRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Proveedor con ID " + id + " no encontrado.");
        }
    }
    
    public Provider findByName(String name) {
        Optional<Provider> provider = providerRepository.findByName(name);
        if (provider.isEmpty()) {
            throw new ResourceNotFoundException("Proveedor " + name + " no encontrado.");
        }
        return provider.get();
    }
    
    @Transactional
    public void updateById(CreateProviderDTO dto, Long id) {
        // check name is available
        Optional<Provider> repeatedProvider = providerRepository.findByName(dto.getName());
        if (repeatedProvider.isPresent()) {
            throw new ExistingAttributeException("El proveedor " + dto.getName() + " ya existe.");
        }
        // check provider exists
        Provider search = this.findById(id);
        ProviderMapper.updateFromDTO(search, dto);
        providerRepository.save(search);
    }

    @Transactional
    public Provider save(CreateProviderDTO dto) {
        // check name is available
        Optional<Provider> repeatedProvider = providerRepository.findByName(dto.getName());
        if (repeatedProvider.isPresent()) {
            throw new ExistingAttributeException("El proveedor " + dto.getName() + " ya existe.");
        }
        Provider newProvider = ProviderMapper.toEntity(dto);
        return providerRepository.save(newProvider);
    }

    @Transactional
    public void deleteById(Long id) {
        Provider provider = this.findById(id);
        List<Long> productIds = productRepository.getIdByProvider(id);
        if (!productIds.isEmpty()) {
            throw new IllegalStateException("No se puede eliminar el proveedor " + provider.getName() + " porque tiene productos asociados.");
        }
        providerRepository.deleteById(id);
    }
    
}
