package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.PartialProductStockDTO;
import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Service.ProductService;
import com.example.febackendproject.Service.ProviderService;
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
@RequestMapping("/provider")
public class ProviderController {
    
    private final ProviderService providerService;
    private final ProductService productService;
    
    public ResponseEntity<?> notFound(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Provider with " + dataType + " " + data + " not found");
    }
    
    public ResponseEntity<?> existingAttribute(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Provider with " + dataType + " " + data + " already exists");
    }
    
    @GetMapping()
    public ResponseEntity<?> list() {
        return ResponseEntity.status(HttpStatus.OK).body(providerService.list());
    }
    
    @GetMapping("/{identifier}")
    public ResponseEntity<?> get(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            Optional<Provider> provider = providerService.findById(id);
            return provider.isEmpty()
                    ? notFound("ID", identifier)
                    : ResponseEntity.ok(provider.get());
        } catch (NumberFormatException e) {
            Optional<Provider> provider = providerService.findByName(identifier);
            return provider.isEmpty()
                    ? notFound("Name", identifier)
                    : ResponseEntity.ok(provider.get());
        }
    }
    
    @GetMapping("/{providerId}/products")
    public ResponseEntity<Page<PartialProductStockDTO>> getPartialByProvider(
            @PathVariable Long providerId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "8") int size
    ) {
        return ResponseEntity.ok(productService.getPartialProductStockByProvider(providerId, page, size));
    }
    
    @PostMapping
    public ResponseEntity<?> save(@RequestBody Provider provider) {
        Optional<Provider> repeatedProvider = providerService.findByName(provider.getName());
        if (repeatedProvider.isPresent()) {
            return existingAttribute("Name", provider.getName());
        }
        Provider newProvider = providerService.save(provider);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProvider);
    }
    
    @PatchMapping
    public ResponseEntity<?> update(@RequestBody Provider provider) {
        if (providerService.existsById(provider.getId())) {
            providerService.updateById(provider);
            return ResponseEntity.ok("Provider updated");
        }
        return notFound("ID", provider.getId().toString());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (providerService.existsById(id)) {
            List<Long> productIds = providerService.getIdByProvider(id);
            if (productIds.isEmpty()) {
                providerService.deleteById(id);
                return ResponseEntity.ok("Provider deleted successfully");
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("The provider has " + productIds.size() + " products associated to it.");
        }
        return notFound("ID", Long.toString(id));
    }
    
    @GetMapping("/top5")
    public ResponseEntity<?> topFive() {
        return ResponseEntity.ok(providerService.listTopFive());
    }
}
