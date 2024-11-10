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
    
    private String measures;
    private String measureType;
    private Double measurePrice;
    
    private Integer discountPercentage;
    private Double discountedPrice;
    
    private String image;
    
}
