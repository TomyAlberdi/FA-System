package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.Product.PartialProductStockDTO;
import com.example.febackendproject.DTO.Provider.CreateProviderDTO;
import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Service.ProductService;
import com.example.febackendproject.Service.ProviderService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/provider")
public class ProviderController {
    
    private final ProviderService providerService;
    private final ProductService productService;
    
    @GetMapping()
    public ResponseEntity<?> list() {
        return ResponseEntity.status(HttpStatus.OK).body(providerService.list());
    }
    
    @GetMapping("/{identifier}")
    public ResponseEntity<?> get(@PathVariable String identifier) {
        try {
            Long id = Long.parseLong(identifier);
            return ResponseEntity.ok(providerService.findById(id));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(providerService.findByName(identifier));
        }
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody CreateProviderDTO dto) {
        providerService.updateById(dto, id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping
    public ResponseEntity<?> save(@RequestBody CreateProviderDTO dto) {
        Provider newProvider = providerService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProvider);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        providerService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/top5")
    public ResponseEntity<?> topFive() {
        return ResponseEntity.ok(providerService.listTopFive());
    }
    
    @GetMapping("/{providerId}/products")
    public ResponseEntity<Page<PartialProductStockDTO>> getPartialByProvider(
            @PathVariable Long providerId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "8") int size
    ) {
        providerService.assertProviderExists(providerId);
        return ResponseEntity.ok(productService.getPartialProductStockByProvider(providerId, page, size));
    }
}
