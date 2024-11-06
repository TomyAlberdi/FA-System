package com.example.febackendproject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

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
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    @NotNull
    @Column
    private String description;
    
    @NotNull
    @Column
    private String quality;
    
    // External Tables data
    @NotNull
    @ElementCollection
    @CollectionTable(name = "product_tags", joinColumns = @JoinColumn(name = "product_id"))
    @Column
    private List<String> tags;
    
    @NotNull
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
    @NotNull
    private Double measurePrice;
    
    // Sale unit data
    @NotNull
    @Column(name = "sale_unit")
    private String saleUnit;
    
    @NotNull
    @Column(name = "sale_unit_price")
    private Double saleUnitPrice;
    
    @NotNull
    @Column(name = "measure_per_sale_unit")
    private Integer measurePerSaleUnit;
    
    // Discount data
    @NotNull
    @Column(name = "discount_percentage")
    private Integer discountPercentage;
    
    @NotNull
    @Column(name = "discounted_price")
    private Double discountedPrice;
    
    /*@Override
    public String toString() {
        return "Product {" +
                "\n  id=" + id +
                ",\n  providerId=" + providerId +
                ",\n  categoryId=" + categoryId +
                ",\n  tags=" + tags +
                ",\n  images=" + images +
                ",\n  name='" + name + '\'' +
                ",\n  description='" + description + '\'' +
                ",\n  price=" + price +
                ",\n  measures='" + measures + '\'' +
                ",\n  saleUnit='" + saleUnit + '\'' +
                ",\n  priceSaleUnit=" + priceSaleUnit +
                ",\n  unitPerBox=" + unitPerBox +
                ",\n  quality='" + quality + '\'' +
                ",\n  discountPercentage=" + discountPercentage +
                ",\n  discountedPrice=" + discountedPrice +
                "\n}";
    }*/

}
