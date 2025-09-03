package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.FilterProductDTO;
import com.example.febackendproject.DTO.Product.CreateProductDTO;
import com.example.febackendproject.DTO.Product.PartialProductDTO;
import com.example.febackendproject.Entity.*;
import com.example.febackendproject.Service.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@Validated
@RequestMapping("/product")
public class ProductController {
    
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<PartialProductDTO>> list(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size) {
        return ResponseEntity.ok().body(productService.getPaginatedPartialProducts(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<PartialProductDTO>> getFilteredPartialProducts(
            FilterProductDTO filter,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size
    ) {
        return ResponseEntity.ok(productService.getFilteredPartialProducts(filter, page, size));
    }
    
    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody CreateProductDTO dto) {
        Product newProduct = productService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProduct);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        productService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@Valid @RequestBody CreateProductDTO dto, @PathVariable Long id) {
        return ResponseEntity.ok(productService.updateById(dto, id));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateDisabled(
            @PathVariable Long id,
            @RequestParam(value = "disabled") Boolean disabled)
    {
        productService.updateDisabled(id, disabled);
        return ResponseEntity.ok().build();
    }
    
    //FIXME refactor discount & price change by provider
//    @PutMapping("/applyDiscountByProvider")
//    public ResponseEntity<?> applyDiscountByProvider(
//            @RequestParam(value = "providerId") Long providerId,
//            @RequestParam(value = "percentage") Integer percentage
//    ) {
//        if (providerService.existsById(providerId)) {
//            productService.applyDiscountByProvider(percentage, providerId);
//            return ResponseEntity.ok("Descuento aplicado");
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
//    }
//
//    @PutMapping("/removeDiscountByProvider")
//    public ResponseEntity<?> removeDiscountByProvider(
//            @RequestParam(value = "providerId") Long providerId,
//            @RequestParam(value = "percentage") Integer percentage
//    ) {
//        if (providerService.existsById(providerId)) {
//            productService.removeDiscountByProvider(percentage, providerId);
//            return ResponseEntity.ok("Descuento actualizado");
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
//    }
//
//    @PutMapping("/increasePriceByProvider")
//    public ResponseEntity<?> increasePriceByProvider(
//            @RequestParam(value = "providerId") Long providerId,
//            @RequestParam(value = "percentage") Integer percentage
//    ) {
//        if (providerService.existsById(providerId)) {
//            productService.increasePriceByProvider(percentage, providerId);
//            return ResponseEntity.ok("Precio actualizado");
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
//    }
//
//    @PutMapping("/reducePriceByProvider")
//    public ResponseEntity<?> reducePriceByProvider(
//            @RequestParam(value = "providerId") Long providerId,
//            @RequestParam(value = "percentage") Integer percentage
//    ) {
//        if (providerService.existsById(providerId)) {
//            productService.reducePriceByProvider(percentage, providerId);
//            return ResponseEntity.ok("Precio actualizado");
//        }
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontró el proveedor con ID: " + providerId.toString());
//    }
    
    @GetMapping("/count")
    public ResponseEntity<?> count() {
        return ResponseEntity.ok(productService.getTotalProducts());
    }
    
}
