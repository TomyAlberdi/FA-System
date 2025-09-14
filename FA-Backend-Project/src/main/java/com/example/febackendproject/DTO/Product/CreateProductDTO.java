package com.example.febackendproject.DTO.Product;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class CreateProductDTO {
    private String name;
    private String description;
    private String quality;
    private String code;
    private String measureType;
    private String measures;
    private String saleUnit;
    private Double saleUnitPrice;
    private Double saleUnitCost;
    private Double measureUnitCost;
    private Double measurePerSaleUnit;
    private Integer discountPercentage;
    private Long providerId;
    private Long categoryId;
    private Long subcategoryId;
    private List<String> images;
    private String color;
    private String origen;
    private String borde;
    private String aspecto;
    private String textura;
    private String transito;
}
