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
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "provider_id")
    @NotNull
    private Long providerId;
    
    @Column(name = "category_id")
    @NotNull
    private Long categoryId;
    
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
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    @NotNull
    @Column
    private String description;
    
    @Column
    @NotNull
    private Double price;
    
    @Column
    @NotNull
    // Medidas
    // Ej: 13cm x 13cm
    private String measures;
    
    @NotNull
    @Column(name = "sale_unit")
    // Unidad
    // Ej: M2
    private String saleUnit;
    
    @NotNull
    @Column(name = "price_sale_unit")
    // Precio por unidad
    // Ej: 100$ x M2
    private Double priceSaleUnit;
    
    @NotNull
    @Column(name = "unit_per_box")
    // Unidad de medida por caja
    // Ej: 10 M2 per box
    private Double unitPerBox;
    
    @NotNull
    @Column
    private String quality;
    
    @NotNull
    @Column(name = "discount_percentage")
    private Integer discountPercentage;
    
    @NotNull
    @Column(name = "discounted_price")
    private Double discountedPrice;
    
    @Override
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
    }

    
}
