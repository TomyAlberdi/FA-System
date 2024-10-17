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
    
    private Integer stock;
    
    @Override
    public String toString() {
        return "Product {" +
                "\n  id=" + id +
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
                ",\n  tags=" + tags +
                ",\n  images=" + images +
                ",\n  category='" + category + '\'' +
                ",\n  provider='" + provider + '\'' +
                "\n}";
    }
    
    
}
