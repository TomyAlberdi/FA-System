package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.Stock.PartialStockDTO;
import com.example.febackendproject.DTO.Stock.StockRecordDTO;
import com.example.febackendproject.DTO.Stock.StockReportMonthDTO;
import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Entity.StockRecord;
import com.example.febackendproject.Repository.StockPaginationRepository;
import com.example.febackendproject.Repository.StockRepository;
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
    
    private void addStockRecordToStock(Stock stock, StockRecord record) {
        if (stock.getStockRecords() == null) {
            stock.setStockRecords(new ArrayList<>());
        }
        stock.getStockRecords().add(0, record);
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
