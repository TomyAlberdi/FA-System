package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.CompleteCategoryDTO;
import com.example.febackendproject.DTO.PartialProductStockDTO;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Subcategory;
import com.example.febackendproject.Service.CategoryService;
import com.example.febackendproject.Service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;
    private final ProductService productService;
    
    public ResponseEntity<?> notFound(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category with " + dataType + " " + data + " not found");
    }
    
    public ResponseEntity<?> existingAttribute(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category with " + dataType + " " + data + " already exists");
    }
    
    @GetMapping()
    public ResponseEntity<?> list() {
        return ResponseEntity.status(HttpStatus.OK).body(categoryService.list());
    }
    
    @GetMapping("/{identifier}")
    public ResponseEntity<?> get(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            Optional<CompleteCategoryDTO> category = categoryService.findById(id);
            return category.isEmpty()
                    ? notFound("ID", identifier)
                    : ResponseEntity.ok(category.get());
        } catch (NumberFormatException e) {
            Optional<CompleteCategoryDTO> category = categoryService.findByName(identifier);
            return category.isEmpty()
                    ? notFound("Name", identifier)
                    : ResponseEntity.ok(category.get());
        }
    }
    
    @GetMapping("/{categoryId}/products")
    public ResponseEntity<Page<PartialProductStockDTO>> getPartialByCategory(
            @PathVariable Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "8") int size
    ) {
        return ResponseEntity.ok(productService.getPartialProductStockByCategory(categoryId, page, size));
    }
    
    @PostMapping("/{name}")
    public ResponseEntity<?> save(@PathVariable String name) {
        Optional<CompleteCategoryDTO> repeatedCategory = categoryService.findByName(name);
        if (repeatedCategory.isPresent()) {
            return existingAttribute("Name", name);
        }
        Category newCategory = categoryService.save(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }
    
    @PatchMapping()
    public ResponseEntity<?> update(@RequestParam(value = "name") String name, @RequestParam(value = "id") Long id) {
        Optional<CompleteCategoryDTO> category = categoryService.findById(id);
        if (category.isEmpty()) {
            return notFound("ID", id.toString());
        }
        categoryService.update(name, id);
        return ResponseEntity.ok("Category updated");
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<CompleteCategoryDTO> category = categoryService.findById(id);
        if (category.isPresent()) {
            List<Long> productIds = categoryService.getIdByCategory(id);
            if (productIds.isEmpty() && category.get().getSubcategories().isEmpty()) {
                categoryService.deleteById(id);
                return ResponseEntity.ok("Category " + category.get().getName() + " deleted successfully");
            }
            if (productIds.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("The category " + category.get().getName() + " has " + productIds.size() + " products associated to it.");
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("The category " + category.get().getName() + " has " + category.get().getSubcategories().size() + " subcategories associated to it.");
            }
        }
        return notFound("ID", Long.toString(id));
    }
    
    @GetMapping("/top5")
    public ResponseEntity<?> topFive() {
        return ResponseEntity.ok(categoryService.listTopFive());
    }
    
    // Subcategories
    
    @GetMapping("/subcategory")
    public ResponseEntity<?> listSubcategories() {
        return ResponseEntity.ok(categoryService.listSubcategories());
    }
    
    @GetMapping("/subcategory/{identifier}")
    public ResponseEntity<?> getSubcategories(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            Optional<Subcategory> subcategory = categoryService.findSubcategoryById(id);
            return subcategory.isEmpty()
                    ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subcategory with ID: " + identifier + " not found")
                    : ResponseEntity.ok(subcategory.get());
        } catch (NumberFormatException e) {
            Optional<Subcategory> subcategory = categoryService.findSubcategoryByName(identifier);
            return subcategory.isEmpty()
                    ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subcategory with name " + identifier + " not found")
                    : ResponseEntity.ok(subcategory.get());
        }
    }
    
    @GetMapping("/{id}/subcategories")
    public ResponseEntity<?> getByCategoryId(@PathVariable Long id) {
        return ResponseEntity.ok().body(categoryService.getByCategoryId(id));
    }
    
    @GetMapping("/subcategory/{subcategoryId}/products")
    public ResponseEntity<Page<PartialProductStockDTO>> getPartialBySubcategory(
            @PathVariable Long subcategoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "8") int size
    ) {
        return ResponseEntity.ok(productService.getPartialProductStockBySubcategory(subcategoryId, page, size));
    }
    
    @PostMapping("/subcategory")
    public ResponseEntity<?> save(@RequestParam String name, @RequestParam Long categoryId) {
        Optional<Subcategory> repeatedSubcategory = categoryService.findSubcategoryByName(name);
        if (repeatedSubcategory.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Subcategory with name " + name + " already exists");
        }
        Subcategory subcategory = categoryService.saveSubcategory(name, categoryId);
        return ResponseEntity.ok(subcategory);
    }
    
    @PatchMapping("/subcategory")
    public ResponseEntity<?> updateSubcategory(@RequestParam String name, @RequestParam Long subcategoryId) {
        Optional<Subcategory> repeatedSubcategory = categoryService.findSubcategoryById(subcategoryId);
        if (repeatedSubcategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subcategory with ID: " + subcategoryId + " not found");
        }
        categoryService.updateSubcategory(name, subcategoryId);
        return ResponseEntity.ok("Subcategory updated");
    }
    
    @DeleteMapping("/subcategory/{id}")
    public ResponseEntity<?> deleteSubcategory(@PathVariable Long id) {
        Optional<Subcategory> repeatedSubcategory = categoryService.findSubcategoryById(id);
        if (repeatedSubcategory.isPresent()) {
            List<Long> productIds = categoryService.getIdBySubcategory(id);
            if(productIds.isEmpty()) {
                categoryService.deleteSubcategoryById(id);
                return ResponseEntity.ok("Subcategory with ID: " + id + " deleted successfully");
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The subcategory " + repeatedSubcategory.get().getName() + " has " + productIds.size() + " products associated to it.");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subcategory with ID: " + id + " not found");
    }

}
