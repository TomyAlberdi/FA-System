package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PartialStockDTO;
import com.example.febackendproject.Entity.Stock;
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
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialStockDTO(s.id,s.productId,s.productName,s.productSaleUnit,s.quantity,s.productImage) FROM Stock s")
    List<PartialStockDTO> listStocks();
    
}
