package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Repository.ProductRepository;
import com.example.febackendproject.Repository.StockRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StockService {
    
    private final StockRepository stockRepository;
    
    public List<Stock> findAll() {
        return stockRepository.findAll();
    }
    
    public Optional<Stock> getByProductId(Long productId) {
        return stockRepository.findByProductId(productId);
    }
    
    public Stock save(Long productId, String productName) {
        Stock stock = new Stock();
        stock.setProductId(productId);
        stock.setProductName(productName);
        return stockRepository.save(stock);
    }

    public void increaseStockById(Long productId, Integer quantity) {
        stockRepository.increaseStock(productId, quantity);
    }
    
    public void decreaseStockById(Long productId, Integer quantity) {
        stockRepository.reduceStock(productId, quantity);
    }
    
    public void deleteStockByProductId(Long productId) {
        stockRepository.deleteByProductId(productId);
    }
    
}
