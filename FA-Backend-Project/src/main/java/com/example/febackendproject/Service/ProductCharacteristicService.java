package com.example.febackendproject.Service;

import com.example.febackendproject.Repository.ProductCharacteristicRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ProductCharacteristicService {
    
    private final ProductCharacteristicRepository productCharacteristicRepository;
    
    public List<String> listKeys() {
        return productCharacteristicRepository.listKeys();
    }
    
    public List<String> listValuesByKey(String key) {
        return productCharacteristicRepository.listValuesByKey(key);
    }
    
    public Boolean existsByValue(String value) {
        return productCharacteristicRepository.existsByValue(value);
    }
    
    public Boolean existsByKey(String key) {
        return productCharacteristicRepository.existsByKey(key);
    }
    
}
