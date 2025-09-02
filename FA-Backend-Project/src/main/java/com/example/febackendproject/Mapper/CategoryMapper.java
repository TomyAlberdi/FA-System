package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.Category.CompleteCategoryDTO;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Subcategory;

import java.util.List;

public class CategoryMapper {
    
    public static CompleteCategoryDTO toDTO(Category category, List<Subcategory> subcategories) {
        CompleteCategoryDTO newCategory = new CompleteCategoryDTO();
        newCategory.setId(category.getId());
        newCategory.setName(category.getName());
        newCategory.setProductsAmount(category.getProductsAmount());
        newCategory.setSubcategories(subcategories);
        return newCategory;
    }
    
}
