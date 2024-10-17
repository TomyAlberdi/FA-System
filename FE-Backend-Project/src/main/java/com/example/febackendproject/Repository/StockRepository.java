package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Stock;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    
    @Query("SELECT s FROM Stock s WHERE s.productId = ?1")
    Optional<Stock> findByProductId(Long productId);
    
    @Query("SELECT s.quantity FROM Stock s WHERE s.productId = ?1")
    Integer getQuantityByProductId(Long productId);
    
    @Modifying
    @Transactional
    @Query("UPDATE Stock SET quantity = quantity + ?2 WHERE productId = ?1")
    void increaseStock(Long productId, Integer quantity);
    
    @Modifying
    @Transactional
    @Query("UPDATE Stock SET quantity = quantity - ?2 WHERE productId = ?1")
    void reduceStock(Long productId, Integer quantity);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Stock WHERE productId = ?1")
    void deleteByProductId(Long productId);
    
}
