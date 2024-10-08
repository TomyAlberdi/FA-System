package com.example.febackendproject.Controller;

import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Service.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;
    
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
            Optional<Category> category = categoryService.findById(id);
            return category.isEmpty()
                    ? notFound("ID", identifier)
                    : ResponseEntity.ok(category.get());
        } catch (NumberFormatException e) {
            Optional<Category> category = categoryService.findByName(identifier);
            return category.isEmpty()
                    ? notFound("Name", identifier)
                    : ResponseEntity.ok(category.get());
        }
    }
    
    @PostMapping("/{name}")
    public ResponseEntity<?> save(@PathVariable String name) {
        Optional<Category> repeatedCategory = categoryService.findByName(name);
        if (repeatedCategory.isPresent()) {
            return existingAttribute("Name", name);
        }
        Category newCategory = categoryService.save(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(newCategory);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Optional<Category> category = categoryService.findById(id);
        if (category.isPresent()) {
            categoryService.deleteById(id);
            return ResponseEntity.ok("Category with ID " + id + " deleted successfully");
        }
        return notFound("ID", Long.toString(id));
    }

}
