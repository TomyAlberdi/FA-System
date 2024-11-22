package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.PartialStockDTO;
import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Entity.StockRecord;
import com.example.febackendproject.Repository.StockPaginationRepository;
import com.example.febackendproject.Repository.StockRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class StockService {
    
    private final StockRepository stockRepository;
    private final StockPaginationRepository stockPaginationRepository;
    
    public Page<PartialStockDTO> getPaginatedStocks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stockPaginationRepository.listStocks(pageable);
    }
    
    public Page<PartialStockDTO> getPaginatedStocksByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return stockPaginationRepository.listStocksByKeyword(keyword, pageable);
    }
    
    public Optional<Stock> getByProductId(Long productId) {
        return stockRepository.findByProductId(productId);
    }
    
    public Stock save(Long productId, String productName, String productImage, String productSaleUnit, String productMeasureType, Double productMeasurePerSaleUnit) {
        Stock stock = new Stock();
        stock.setProductId(productId);
        stock.setProductName(productName);
        stock.setProductImage(productImage);
        stock.setProductSaleUnit(productSaleUnit);
        stock.setProductMeasureType(productMeasureType);
        stock.setProductMeasurePerSaleUnit(productMeasurePerSaleUnit);
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
        stock.getStockRecords().add(0, record);
    }
    
}
