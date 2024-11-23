package com.example.febackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompleteProductDTO {
    
    private Long id;
    private String name;
    private Boolean disabled = false;
    private String description;
    private String quality;
    
    private String measureType;
    private String measures;
    private Double measurePrice;
    
    private String saleUnit;
    private Double saleUnitPrice;
    private Double measurePerSaleUnit;
    
    private Integer discountPercentage;
    private Double discountedPrice;
    private Double discountedMeasurePrice;
    
    private List<String> images;
    private Set<Long> characteristicsIds;
    
    private String category;
    private Long categoryId;
    private String subcategory;
    private Long subcategoryId;
    private String provider;
    private Long providerId;
    
    private Integer stock;
    
}
