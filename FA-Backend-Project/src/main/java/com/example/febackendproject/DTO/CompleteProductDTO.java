package com.example.febackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompleteProductDTO {
    
    private Long id;
    private String name;
    private String description;
    private String quality;
    
    private String measureType;
    private String measures;
    private Double measurePrice;
    
    private String saleUnit;
    private Double saleUnitPrice;
    private Integer measurePerSaleUnit;
    
    private Integer discountPercentage;
    private Double discountedPrice;
    
    private List<String> tags;
    private List<String> images;
    
    private String category;
    private String subcategory;
    private String provider;
    
    private Integer stock;
    
}
