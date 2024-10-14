package com.example.febackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CompleteProductDTO {
    
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String measures;
    private String saleUnit;
    private Double priceSaleUnit;
    private Double unitPerBox;
    private String quality;
    private Integer discountPercentage;
    private Double discountedPrice;
    
    private List<String> tags;
    private List<String> images;
    
    private String category;
    private String provider;
    
}
