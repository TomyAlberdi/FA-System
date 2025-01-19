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
@Entity
@Table(name = "budget_products")
public class ProductBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // Own Columns
    private String productCode;
    // Product Identification: Provider + Name
    private String productIdentification;
    private String productQuality;
    private String productMeasures;
    private Double productMeasurePrice;
    private Double measureUnitQuantity;
    private Integer saleUnitQuantity;
    private Double subtotal;
    // not own column, extra data
    private String productSaleUnit;
    private String productMeasureUnit;


}
