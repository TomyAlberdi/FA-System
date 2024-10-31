package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Repository.CategoryRepository;
import com.example.febackendproject.Repository.ProductRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    public List<Category> list() {
        List<Category> categories = categoryRepository.findAll();
        for (Category category : categories) {
            category.setProductsAmount(productRepository.getProductAmountByCategory(category.getId()));
        }
        return categories;
    }
    
    public Optional<Category> findById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        category.ifPresent(value -> value.setProductsAmount(productRepository.getProductAmountByCategory(id)));
        return category;
    }
    
    public Optional<Category> findByName(String name) {
        Optional<Category> category = categoryRepository.findByName(name);
        category.ifPresent(value -> value.setProductsAmount(productRepository.getProductAmountByCategory(category.get().getId())));
        return category;
    }
    
    public void update(String name, Long id) {
        categoryRepository.updateById(name, id);
    }
    
    public Category save(String name) {
        Category newCategory = new Category();
        newCategory.setName(name);
        return categoryRepository.save(newCategory);
    }
    
    public List<Long> getIdByCategory(Long categoryId) {
        return productRepository.getIdByCategory(categoryId);
    }
    
    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

}
