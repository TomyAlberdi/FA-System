package com.example.febackendproject.Controller;

import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Service.ProductService;
import com.example.febackendproject.Service.StockService;
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
@RequestMapping("/stock")
public class StockController {
    
    private final StockService stockService;
    private final ProductService productService;
    
    public ResponseEntity<?> notFound(String dataType, String data) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product with " + dataType + " " + data + " not found");
    }
    
    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.status(HttpStatus.OK).body(stockService.findAll());
    }
    
    @PatchMapping("/increase")
    public ResponseEntity<?> increaseStock(@RequestParam Long productId, @RequestParam Integer quantity) {
        Optional<Stock> stock = stockService.getByProductId(productId);
        if (productService.existById(productId)) {
            if (stock.isPresent() && stock.get().getQuantity() >= quantity) {
                stockService.increaseStockById(productId, quantity);
                return ResponseEntity.ok().body("Stock updated");
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Requested Stock is greater than current Stock.");
        }
        return notFound("ID", productId.toString());
    }
    
    @PatchMapping("/reduce")
    public ResponseEntity<?> reduceStock(@RequestParam Long productId, @RequestParam Integer quantity) {
        if (productService.existById(productId)) {
            stockService.decreaseStockById(productId, quantity);
            return ResponseEntity.ok().body("Stock updated");
        } else {
            return notFound("ID", productId.toString());
        }
    }
    
}
