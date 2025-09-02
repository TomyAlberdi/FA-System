package com.example.febackendproject.DTO.Product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PartialProductDTO {
    
    private Long id;
    private String name;
    private Boolean disabled = false;
    
    private String measureType;
    private Double measurePrice;
    
    private String saleUnit;
    private String saleUnitPrice;
    private Double measurePerSaleUnit;
    
    private Integer discountPercentage;
    private Double discountedPrice;
    private Double discountedMeasurePrice;
    
    private String image;
    
}
