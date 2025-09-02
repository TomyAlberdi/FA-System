package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.Category.CompleteCategoryDTO;
import com.example.febackendproject.DTO.PartialProductStockDTO;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Subcategory;
import com.example.febackendproject.Service.CategoryService;
import com.example.febackendproject.Service.ProductService;
import com.example.febackendproject.Service.SubcategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Validated
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;
    private final ProductService productService;
    private final SubcategoryService subcategoryService;
    
    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.list());
    }
    
    @GetMapping("/top5")
    public ResponseEntity<?> topFive() {
        return ResponseEntity.ok(categoryService.listTopFive());
    }
    
    @GetMapping("/{identifier}")
    public ResponseEntity<?> get(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return ResponseEntity.ok(categoryService.findById(id));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(categoryService.findByName(identifier));
        }
    }
    
    @PatchMapping
    public ResponseEntity<?> update(@RequestParam(value = "name") String name, @RequestParam(value = "id") Long id) {
        categoryService.update(name, id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/{name}")
    public ResponseEntity<?> save(@PathVariable String name) {
        Category newCategory = categoryService.save(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        categoryService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{categoryId}/products")
    public ResponseEntity<Page<PartialProductStockDTO>> getPartialByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "8") int size
    ) {
        CompleteCategoryDTO category = categoryService.findById(categoryId);
        return ResponseEntity.ok(productService.getPartialProductStockByCategory(categoryId, page, size));
    }
    
    // Subcategories
    
    @GetMapping("/subcategory")
    public ResponseEntity<?> listSubcategories() {
        return ResponseEntity.ok(subcategoryService.list());
    }
    
    @GetMapping("/subcategory/{identifier}")
    public ResponseEntity<?> getSubcategory(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return ResponseEntity.ok(subcategoryService.findById(id));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(subcategoryService.findByName(identifier));
        }
    }
    
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<?> getByCategoryId(@PathVariable Long id) {
        return ResponseEntity.ok().body(subcategoryService.getByCategoryId(id));
    }
    
    @GetMapping("/subcategory/{subcategoryId}/products")
    public ResponseEntity<Page<PartialProductStockDTO>> getPartialBySubcategory(
            @PathVariable Long subcategoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "8") int size
    ) {
        Subcategory subcategory = subcategoryService.findById(subcategoryId);
        return ResponseEntity.ok(productService.getPartialProductStockBySubcategory(subcategoryId, page, size));
    }
    
    @PatchMapping("/subcategory")
    public ResponseEntity<?> updateSubcategory(@RequestParam String name, @RequestParam Long subcategoryId) {
        subcategoryService.update(name, subcategoryId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/subcategory")
    public ResponseEntity<?> save(@RequestParam String name, @RequestParam Long categoryId) {
        Subcategory subcategory = subcategoryService.save(name, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(subcategory);
    }
    
    @DeleteMapping("/subcategory/{id}")
    public ResponseEntity<?> deleteSubcategory(@PathVariable Long id) {
        subcategoryService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
