package com.example.febackendproject.DTO.Stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartialStockDTO {
    
    private Long id;
    private Long productId;
    private String productName;
    private String productSaleUnit;
    private Integer quantity = 0;
    private String productImage;
    
}
