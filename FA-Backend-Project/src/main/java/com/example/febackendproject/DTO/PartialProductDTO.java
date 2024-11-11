package com.example.febackendproject.DTO;

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
    
    private String measureType;
    
    private String saleUnit;
    private Double saleUnitPrice;
    private Integer measurePerSaleUnit;
    
    private Integer discountPercentage;
    private Double discountedPrice;
    
    private String image;
    
}
