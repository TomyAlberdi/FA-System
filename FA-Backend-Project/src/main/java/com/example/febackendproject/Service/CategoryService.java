package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.CompleteCategoryDTO;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Subcategory;
import com.example.febackendproject.Exception.ExistingAttributeException;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Mapper.CategoryMapper;
import com.example.febackendproject.Repository.CategoryRepository;
import com.example.febackendproject.Repository.ProductRepository;
import com.example.febackendproject.Repository.SubcategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final ProductService productService;
    
    public List<Category> list() {
        return categoryRepository.findAll();
    }
    
    public List<Category> listTopFive() {
        return categoryRepository.listTopFiveByProductAmount();
    }
    
    public CompleteCategoryDTO findById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isEmpty()) {
            throw new ResourceNotFoundException("Cateroría con ID " + id + " no encontrada.");
        }
        List<Subcategory> subcategories = subcategoryRepository.findByCategoryId(id);
        return CategoryMapper.toDTO(category.get(), subcategories);
    }
    
    public CompleteCategoryDTO findByName(String name) {
        Optional<Category> category = categoryRepository.findByName(name);
        if (category.isEmpty()) {
            throw new ResourceNotFoundException("Cateroría " + name + " no encontrada.");
        }
        List<Subcategory> subcategories = subcategoryRepository.findByCategoryId(category.get().getId());
        return CategoryMapper.toDTO(category.get(), subcategories);
    }
    
    @Transactional
    public void update(String name, Long id) {
        Optional<Category> repeatedCategory = categoryRepository.findByName(name);
        if (repeatedCategory.isPresent()) {
            throw new ExistingAttributeException("La categoría con nombre " + name + " ya existe.");
        }
        CompleteCategoryDTO category = this.findById(id);
        categoryRepository.updateById(name, id);
    }
    
    @Transactional
    public Category save(String name) {
        Optional<Category> repeatedCategory = categoryRepository.findByName(name);
        if (repeatedCategory.isPresent()) {
            throw new ExistingAttributeException("La categoría con nombre " + name + " ya existe.");
        }
        Category newCategory = new Category();
        newCategory.setName(name);
        return categoryRepository.save(newCategory);
    }
    
    @Transactional
    public void deleteById(Long id) {
        CompleteCategoryDTO category = this.findById(id);
        if (!category.getSubcategories().isEmpty()) {
            throw new IllegalStateException("No se puede eliminar la categoría " + category.getName() + " porque tiene subcategorías asociadas.");
        }
        List<Long> productIds = productService.getProductIdsByCategory(id);
        if (!productIds.isEmpty()) {
            throw new IllegalStateException("No se puede eliminar la categoría " + category.getName() + " porque tiene productos asociados.");
        }
        categoryRepository.deleteById(id);
    }
    
}
