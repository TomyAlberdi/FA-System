package com.example.febackendproject.DTO;

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
    private Integer Stock;
    
    private String measureType;
    private Double measurePrice;
    
    private String saleUnit;
    private Double measurePerSaleUnit;
    private Double saleUnitPrice;

}
