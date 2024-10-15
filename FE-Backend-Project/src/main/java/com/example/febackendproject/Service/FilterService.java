package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.MeasureDTO;
import com.example.febackendproject.DTO.PricesDTO;
import com.example.febackendproject.Repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FilterService {
    
    private final ProductRepository productRepository;
    
    public List<MeasureDTO> getMeasure() {
        return productRepository.getMeasures();
    }
    
    public PricesDTO getPrices() {
        return productRepository.getPrices();
    }
    
}
