package com.example.febackendproject.DTO;

import com.example.febackendproject.Entity.Subcategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CompleteCategoryDTO {
    
    private Long id;
    private String name;
    private Integer productsAmount = 0;
    private List<Subcategory> subcategories;
    
}
