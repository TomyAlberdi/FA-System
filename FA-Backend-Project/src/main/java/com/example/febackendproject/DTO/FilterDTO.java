package com.example.febackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FilterDTO {
    
    private Long categoryId;
    private Long providerId;
    private String measure;
    private Double minPrice;
    private Double maxPrice;
    private Boolean discount;
    
}
