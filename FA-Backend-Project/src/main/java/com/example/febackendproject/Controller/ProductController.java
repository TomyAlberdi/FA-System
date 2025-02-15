package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.CompleteCategoryDTO;
import com.example.febackendproject.DTO.CompleteProductDTO;
import com.example.febackendproject.DTO.FilterProductDTO;
import com.example.febackendproject.DTO.PartialProductDTO;
import com.example.febackendproject.Entity.*;
import com.example.febackendproject.Repository.SubcategoryRepository;
import com.example.febackendproject.Service.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/product")
public class ProductController {
    
    private final ProductService productService;
    private final ProviderService providerService;
    private final CategoryService categoryService;
    private final StockService stockService;
    private final SubcategoryRepository subcategoryRepository;
    
    public ResponseEntity<?> notFound(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product with " + dataType + " " + data + " not found");
    }
    
    public ResponseEntity<?> existingAttribute(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Product with " + dataType + " " + data + " already exists");
    }
    
    @GetMapping()
    public ResponseEntity<Page<PartialProductDTO>> list(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size) {
        return ResponseEntity.ok().body(productService.getPaginatedPartialProducts(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Optional<CompleteProductDTO> product = productService.getById(id);
        return product.isPresent()
                ? ResponseEntity.ok(product)
                : notFound("ID", id.toString());
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<PartialProductDTO>> getFilteredPartialProducts(
            FilterProductDTO filter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size
    ) {
        return ResponseEntity.ok(productService.getFilteredPartialProducts(filter, page, size));
    }
    
    @PostMapping()
    public ResponseEntity<?> save(@Valid @RequestBody Product product) {
        Optional<CompleteCategoryDTO> category = categoryService.findById(product.getCategoryId());
        Optional<Provider> provider = providerService.findById(product.getProviderId());
        Optional<Subcategory> subcategory = subcategoryRepository.findById(product.getSubcategoryId());
        if (productService.existByName(product.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Product with id " + product.getId() + " already exists");
        } else if (category.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category with id " + product.getCategoryId() + " not found");
        } else if (provider.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provider with id " + product.getProviderId() + " not found");
        } else if (subcategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Subcategory with id " + product.getSubcategoryId() + " not found");
        }
        Product newProduct = productService.save(product);
        if (newProduct.getImages().isEmpty()) {
            Stock newStock = stockService.save(newProduct.getId(), newProduct.getName(), "", newProduct.getSaleUnit(), newProduct.getMeasureType(), newProduct.getMeasurePerSaleUnit());
        } else {
            Stock newStock = stockService.save(newProduct.getId(), newProduct.getName(), newProduct.getImages().get(0), newProduct.getSaleUnit(), newProduct.getMeasureType(), newProduct.getMeasurePerSaleUnit());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        Optional<CompleteProductDTO> product = productService.getById(id);
        if (product.isPresent()) {
            productService.deleteById(id);
            stockService.deleteStockByProductId(id);
            return ResponseEntity.ok("Product with id " + id + " deleted.");
        }
        return notFound("ID", id.toString());
    }
    
    @PutMapping()
    public ResponseEntity<?> updateById(@Valid @RequestBody Product product) {
        if (!productService.existById(product.getId())) {
            return notFound("ID", product.getId().toString());
        }
        if (categoryService.findById(product.getCategoryId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category with id " + product.getCategoryId() + " not found");
        } else if (providerService.findById(product.getProviderId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provider with id " + product.getProviderId() + " not found");
        } else if (subcategoryRepository.findById(product.getSubcategoryId()).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Subcategory with id " + product.getSubcategoryId() + " not found");
        }
        Product newProduct = productService.save(product);
        return ResponseEntity.ok("Product updated.");
    }
    
    @PatchMapping()
    public ResponseEntity<?> updateDisabled(
            @RequestParam(value = "productId") Long productId,
            @RequestParam(value = "disabled") Boolean disabled)
    {
        Boolean productExists = productService.existById(productId);
        if (productExists) {
            Optional<Product> returnProduct = productService.updateDisabled(productId, disabled);
            return ResponseEntity.ok(returnProduct);
        } else {
            return notFound("ID", productId.toString());
        }
    }
    
    @PutMapping("/applyDiscountByProvider")
    public ResponseEntity<?> applyDiscountByProvider(
            @RequestParam(value = "providerId") Long providerId,
            @RequestParam(value = "percentage") Integer percentage
    ) {
        if (providerService.existsById(providerId)) {
            productService.applyDiscountByProvider(percentage, providerId);
            return ResponseEntity.ok("Descuento aplicado");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
    }
    
    @PutMapping("/removeDiscountByProvider")
    public ResponseEntity<?> removeDiscountByProvider(
            @RequestParam(value = "providerId") Long providerId,
            @RequestParam(value = "percentage") Integer percentage
    ) {
        if (providerService.existsById(providerId)) {
            productService.removeDiscountByProvider(percentage, providerId);
            return ResponseEntity.ok("Descuento actualizado");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
    }
    
    @PutMapping("/increasePriceByProvider")
    public ResponseEntity<?> increasePriceByProvider(
            @RequestParam(value = "providerId") Long providerId,
            @RequestParam(value = "percentage") Integer percentage
    ) {
        if (providerService.existsById(providerId)) {
            productService.increasePriceByProvider(percentage, providerId);
            return ResponseEntity.ok("Precio actualizado");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
    }
    
    @PutMapping("/reducePriceByProvider")
    public ResponseEntity<?> reducePriceByProvider(
            @RequestParam(value = "providerId") Long providerId,
            @RequestParam(value = "percentage") Integer percentage
    ) {
        if (providerService.existsById(providerId)) {
            productService.reducePriceByProvider(percentage, providerId);
            return ResponseEntity.ok("Precio actualizado");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
    }
    
    @GetMapping("/count")
    public ResponseEntity<?> count() {
        return ResponseEntity.ok(productService.getTotalProducts());
    }
    
}
