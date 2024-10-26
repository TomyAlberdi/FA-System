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
    private Double price;
    private String salesUnit;
    private Double priceSaleUnit;
    private Integer discountPercentage;
    private Double discountedPrice;
    
    private String image;
    
}
