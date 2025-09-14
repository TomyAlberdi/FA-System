package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.Stock.PartialStockDTO;
import com.example.febackendproject.DTO.Stock.StockRecordDTO;
import com.example.febackendproject.DTO.Stock.StockReportMonthDTO;
import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Entity.StockRecord;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Mapper.StockMapper;
import com.example.febackendproject.Repository.StockPaginationRepository;
import com.example.febackendproject.Repository.StockRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class StockService {
    
    private final StockRepository stockRepository;
    private final StockPaginationRepository stockPaginationRepository;
    
    public Page<PartialStockDTO> getPaginatedStocksByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (keyword == null || keyword.isEmpty()) {
            return stockPaginationRepository.listStocks(pageable);
        }
        return stockPaginationRepository.listStocksByKeyword(keyword, pageable);
    }
    
    public Stock getByProductId(Long productId) {
        this.assertStockExists(productId);
        return stockRepository.findByProductId(productId).orElse(null);
    }
    
    public void assertStockExists(Long productId) {
        if (stockRepository.findByProductId(productId).isEmpty()) {
            throw new ResourceNotFoundException("El Stock del producto ID " + productId + " no existe.");
        }
    }
    
    @Transactional
    public Stock save(Product product) {
        Stock stock = StockMapper.createNewStock(product);
        return stockRepository.save(stock);
    }

    @Transactional
    public void increaseStockById(Long productId, Integer quantity) {
        Optional<Stock> search = stockRepository.findByProductId(productId);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Stock del producto ID " + productId + " no encontrado.");
        }
        Stock stock = search.get();
        Integer newStock = stock.getQuantity() + quantity;
        stock.setQuantity(newStock);
        StockRecord record = new StockRecord("INCREASE", quantity, LocalDateTime.now());
        addStockRecordToStock(stock, record);
        stockRepository.save(stock);
    }
    
    @Transactional
    public void decreaseStockById(Long productId, Integer quantity) {
        Optional<Stock> search = stockRepository.findByProductId(productId);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Stock del producto ID " + productId + " no encontrado.");
        }
        Stock stock = search.get();
        if (stock.getQuantity() >= quantity) {
            Integer newStock = stock.getQuantity() - quantity;
            stock.setQuantity(newStock);
            StockRecord record = new StockRecord("DECREASE", quantity, LocalDateTime.now());
            addStockRecordToStock(stock, record);
            stockRepository.save(stock);
        }
    }
    
    private void addStockRecordToStock(Stock stock, StockRecord record) {
        if (stock.getStockRecords() == null) {
            stock.setStockRecords(new ArrayList<>());
        }
        stock.getStockRecords().add(record);
    }
    
    public List<StockRecordDTO> getLastRecords() {
        List<Object[]> results = stockRepository.getLastRecordsNative();
        return results.stream().map(row -> {
            Timestamp date = (Timestamp) row[5];
            StockRecord stockRecord = new StockRecord((String) row[3], (Integer) row[4], date.toLocalDateTime());
            return new StockRecordDTO((Long) row[0], (String) row[1], (String) row[2], stockRecord);
        }).collect(Collectors.toList());
    }
    
    public List<StockReportMonthDTO> getReportStock() {
        List<Object[]> rawData = stockRepository.getStocksByMonth();
        Map<String, StockReportMonthDTO> reportMap = new LinkedHashMap<>();
        
        Locale spanishLocale = new Locale("es", "ES");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM", spanishLocale);
        
        LocalDate now = LocalDate.now();
        for (int i = 0; i < 6; i++) {
            String month = now.minusMonths(i).format(formatter);
            reportMap.put(month, new StockReportMonthDTO(month, 0, 0));
        }
        
        for (Object[] record : rawData) {
            String rawMonth = (String) record[0];
            String recordType = (String) record[1];
            Integer total = ((Number) record[2]).intValue();
            
            YearMonth yearMonth = YearMonth.parse(rawMonth, DateTimeFormatter.ofPattern("yyyy-MM"));
            String month = yearMonth.format(formatter);
            
            StockReportMonthDTO report = reportMap.get(month);
            if (report != null) {
                if ("INCREASE".equals(recordType)) {
                    report.setIN(total);
                } else if ("DECREASE".equals(recordType)) {
                    report.setOUT(total);
                }
            }
        }
        return new ArrayList<>(reportMap.values());
    }
    
}
