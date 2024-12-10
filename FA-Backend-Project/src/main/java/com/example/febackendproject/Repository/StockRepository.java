package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.StockRecordDTO;
import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Entity.StockRecord;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    
    @Query("SELECT s FROM Stock s WHERE s.productId = ?1")
    Optional<Stock> findByProductId(Long productId);
    
    @Query("SELECT s.quantity FROM Stock s WHERE s.productId = ?1")
    Integer getQuantityByProductId(Long productId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Stock WHERE productId = ?1")
    void deleteByProductId(Long productId);
    
    @Query(value = "SELECT s.product_id, s.product_name, s.product_sale_unit, " +
            "sr.record_type, sr.quantity_change, sr.record_date " + // Map specific StockRecord fields
            "FROM stock s " +
            "JOIN stock_records sr ON s.id = sr.stock_id " +
            "ORDER BY sr.record_date DESC LIMIT 5",
            nativeQuery = true)
    List<Object[]> getLastRecordsNative();
    
}
