package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.CompleteCategoryDTO;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Subcategory;
import com.example.febackendproject.Repository.CategoryRepository;
import com.example.febackendproject.Repository.ProductRepository;
import com.example.febackendproject.Repository.SubcategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final ProductRepository productRepository;
    
    public List<Category> list() {
        return categoryRepository.findAll();
    }
    
    public List<Category> listTopFive() {
        return categoryRepository.listTopFiveByProductAmount();
    }
    
    public Optional<CompleteCategoryDTO> findById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        
        CompleteCategoryDTO newCategory = new CompleteCategoryDTO();
        if (category.isPresent()) {
            newCategory.setName(category.get().getName());
            newCategory.setId(id);
            newCategory.setSubcategories(subcategoryRepository.findByCategoryId(id));
        }
        
        return Optional.of(newCategory);
    }
    
    public Optional<CompleteCategoryDTO> findByName(String name) {
        Optional<Category> category = categoryRepository.findByName(name);
        Optional<CompleteCategoryDTO> newCategory = Optional.empty();
        if (category.isPresent()) {
            newCategory.get().setName(category.get().getName());
            newCategory.get().setId(category.get().getId());
            newCategory.get().setSubcategories(subcategoryRepository.findByCategoryId(category.get().getId()));
        }
        return newCategory;
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
    
    // Subcategories
    
    public List<Subcategory> listSubcategories() {
        return subcategoryRepository.findAll();
    }
    
    public Optional<Subcategory> findSubcategoryById(Long id) {
        return subcategoryRepository.findById(id);
    }
    
    public Optional<Subcategory> findSubcategoryByName(String name) {
        return subcategoryRepository.findByName(name);
    }
    
    public void updateSubcategory(String name, Long id) {
        subcategoryRepository.updateById(name, id);
    }
    
    public Subcategory saveSubcategory(String name, Long categoryId) {
        Subcategory newSubcategory = new Subcategory();
        newSubcategory.setName(name);
        newSubcategory.setCategoryId(categoryId);
        return subcategoryRepository.save(newSubcategory);
    }
    
    public List<Long> getIdBySubcategory(Long subcategoryId) {
        return productRepository.getIdBySubcategory(subcategoryId);
    }
    
    public void deleteSubcategoryById(Long subcategoryId) {
        subcategoryRepository.deleteById(subcategoryId);
    }
    
    public List<Subcategory> getByCategoryId(Long categoryId) {
        return subcategoryRepository.findByCategoryId(categoryId);
    }
    
}
