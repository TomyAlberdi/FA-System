package com.example.febackendproject.DTO.Stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateStockDTO {
    
    private Long productId;
    private String productName;
    private String productImage;
    private String productSaleUnit;
    private String productMeasureType;
    private Double productMeasurePerSaleUnit;
    
}
