package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.Stock.PartialStockDTO;
import com.example.febackendproject.Service.StockService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@RequestMapping("/stock")
public class StockController {
    
    private final StockService stockService;

    @GetMapping
    public ResponseEntity<Page<PartialStockDTO>> search(
            @RequestParam(value = "keyword", defaultValue = "") String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "9") int size
    ) {
        return ResponseEntity.ok(stockService.getPaginatedStocksByKeyword(keyword, page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getStockByProductId(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getByProductId(id));
    }
    
    @PatchMapping("/increase")
    public ResponseEntity<?> increaseStock(@RequestParam Long productId, @RequestParam Integer quantity) {
        stockService.assertStockExists(productId);
        stockService.increaseStockById(productId, quantity);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/reduce")
    public ResponseEntity<?> reduceStock(@RequestParam Long productId, @RequestParam Integer quantity) {
        stockService.assertStockExists(productId);
        stockService.decreaseStockById(productId, quantity);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/lastRecords")
    public ResponseEntity<?> getLastRecords() {
        return ResponseEntity.ok(stockService.getLastRecords());
    }
    
    @GetMapping("/reportStock")
    public ResponseEntity<?> getReportStock() {
        return ResponseEntity.ok(stockService.getReportStock());
    }
    
}
