package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Entity.StockRecord;
import com.example.febackendproject.Repository.StockRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
        Optional<Stock> stock = stockRepository.findByProductId(productId);
        if (stock.isPresent()) {
                stock.get().setQuantity(stock.get().getQuantity() + quantity);
                StockRecord record = new StockRecord("INCREASE", quantity, LocalDateTime.now());
                addStockRecordToStock(stock.get(), record);
                stockRepository.save(stock.get());
        }
    }
    
    public void decreaseStockById(Long productId, Integer quantity) {
        Optional<Stock> stock = stockRepository.findByProductId(productId);
        if (stock.isPresent() && stock.get().getQuantity() >= quantity) {
            stock.get().setQuantity(stock.get().getQuantity() - quantity);
            StockRecord record = new StockRecord("DECREASE", quantity, LocalDateTime.now());
            addStockRecordToStock(stock.get(), record);
            stockRepository.save(stock.get());
        }
    }
    
    public void deleteStockByProductId(Long productId) {
        stockRepository.deleteByProductId(productId);
    }
    
    private void addStockRecordToStock(Stock stock, StockRecord record) {
        if (stock.getStockRecords() == null) {
            stock.setStockRecords(new ArrayList<>());
        }
        stock.getStockRecords().add(record);
    }
    
}
