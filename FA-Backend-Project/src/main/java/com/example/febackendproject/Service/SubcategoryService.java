package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.Category.CompleteCategoryDTO;
import com.example.febackendproject.Entity.Subcategory;
import com.example.febackendproject.Exception.ExistingAttributeException;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Repository.SubcategoryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SubcategoryService {
    
    private final SubcategoryRepository subcategoryRepository;
    private final CategoryService categoryService;
    private final ProductService productService;
    
    public List<Subcategory> list() {
        return subcategoryRepository.findAll();
    }
    
    public Subcategory findById(Long id) {
        Optional<Subcategory> subcategory = subcategoryRepository.findById(id);
        if (subcategory.isEmpty()) {
            throw new ResourceNotFoundException("Subcategoría con ID " + id + " no encontrada.");
        }
        return subcategory.get();
    }
    
    public Subcategory findByName(String name) {
        Optional<Subcategory> subcategory = subcategoryRepository.findByName(name);
        if (subcategory.isEmpty()) {
            throw new ResourceNotFoundException("Subcategoría " + name + " no encontrada.");
        }
        return subcategory.get();
    }
    
    @Transactional
    public void update(String name, Long id) {
        // Check name is available
        Optional<Subcategory> repeatedSubcategory = subcategoryRepository.findByName(name);
        if (repeatedSubcategory.isPresent()) {
            throw new ExistingAttributeException("La subcategoría " + name + " ya existe.");
        }
        subcategoryRepository.updateById(name, id);
    }
    
    @Transactional
    public Subcategory save(String name, Long categoryId) {
        // Check categoría exists
        CompleteCategoryDTO category = categoryService.findById(categoryId);
        // Check name is available
        Optional<Subcategory> repeatedSubcategory = subcategoryRepository.findByName(name);
        if (repeatedSubcategory.isPresent()) {
            throw new ExistingAttributeException("La subcategoría " + name + " ya existe.");
        }
        Subcategory newSubcategory = new Subcategory();
        newSubcategory.setName(name);
        newSubcategory.setCategoryId(categoryId);
        return subcategoryRepository.save(newSubcategory);
    }

    @Transactional
    public void deleteById(Long subcategoryId) {
        Subcategory subcategory = this.findById(subcategoryId);
        List<Long> productIds = productService.getProductIdsBySubcategory(subcategoryId);
        if (!productIds.isEmpty()) {
            throw new IllegalStateException("No se puede eliminar la subcategoría " + subcategory.getName() + " porque tiene productos asociados.");
        }
        subcategoryRepository.deleteById(subcategoryId);
    }
    
    public List<Subcategory> getByCategoryId(Long categoryId) {
        CompleteCategoryDTO category = categoryService.findById(categoryId);
        return subcategoryRepository.findByCategoryId(categoryId);
    }
    
    
}
