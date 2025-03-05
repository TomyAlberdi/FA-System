package com.example.febackendproject.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class ProductBudget {

    private Long id;
    private String productName;
    private Double productMeasurePrice;
    private Double measureUnitQuantity;
    private Integer saleUnitQuantity;
    private Integer discount;
    private Double subtotal;
    private String productSaleUnit;
    private String productMeasureUnit;
    private Double saleUnitPrice;

}
