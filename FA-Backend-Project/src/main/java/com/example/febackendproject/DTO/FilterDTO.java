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
    
    private Long subcategoryId;
    private Long providerId;
    private String measures;
    private Double minPrice;
    private Double maxPrice;
    private Boolean discount;
    
}
