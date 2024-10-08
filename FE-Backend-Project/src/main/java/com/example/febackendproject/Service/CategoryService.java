package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.CategoryDTO;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Repository.CategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    
    public List<Category> list() {
        return categoryRepository.findAll();
    }
    
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }
    
    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    public Category save(String name) {
        Category newCategory = new Category();
        newCategory.setName(name);
        return categoryRepository.save(newCategory);
    }
    
    public void deleteById(Long id) {
        categoryRepository.deleteById(id);
    }

}
