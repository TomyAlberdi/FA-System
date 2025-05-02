package com.example.febackendproject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    
    // Basic data
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @NotNull
    private String code;
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    @Column
    private Boolean disabled = false;
    
    @NotNull
    @Column
    private String description;
    
    @NotNull
    @Column
    private String quality;
    
    @Column(name = "main_image")
    private String mainImage;
    
    // External Tables data
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column
    private List<String> images;
    
    @Column(name = "provider_id")
    @NotNull
    private Long providerId;
    
    @Column(name = "category_id")
    @NotNull
    private Long categoryId;
    
    @Column(name = "subcategory_id")
    @NotNull
    private Long subcategoryId;

    // Measure data
    @Column
    @NotNull
    private String measureType;
    
    @Column
    private String measures;
    
    @Column
    private Double measurePrice;
    
    // Sale unit data
    @NotNull
    @Column(name = "sale_unit")
    private String saleUnit;
    
    @Column
    private String saleUnitCost;
    
    @Column
    private String measureUnitCost;
    
    @NotNull
    @Column(name = "sale_unit_price")
    private String saleUnitPrice;
    
    @Column(name = "measure_per_sale_unit")
    private Double measurePerSaleUnit;
    
    // Discount data
    @NotNull
    @Column(name = "discount_percentage")
    private Integer discountPercentage;
    
    @Column(name = "discounted_price")
    private Double discountedPrice;
    
    @Column(name = "discounted_measure_price")
    private Double discountedMeasurePrice;
    
    // Characteristics
    
    @Column
    private String color;
    
    @Column
    private String origen;
    
    @Column
    private String borde;
    
    @Column
    private String aspecto;
    
    @Column
    private String textura;
    
    @Column
    private String transito;

}
