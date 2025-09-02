package com.example.febackendproject.DTO.Product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PartialProductStockDTO {

    private Long id;
    private String name;
    private Boolean disabled = false;
    private Integer Stock;
    
    private String measureType;
    private String saleUnit;
    private Double measurePerSaleUnit;
    private String saleUnitPrice;
    
    private Integer discountPercentage;
    private Double discountedPrice;

}
