package com.example.febackendproject.DTO.Product;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateProductDTO {
    private String code;
    private String name;
    private String description;
    private String quality;
    private String mainImage;
    private List<String> images;
    private Long providerId;
    private Long categoryId;
    private Long subcategoryId;
    private String measureType;
    private String measures;
    private Double measurePrice;
    private String saleUnit;
    private String saleUnitCost;
    private String measureUnitCost;
    
}
