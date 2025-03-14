package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.MeasureDTO;
import com.example.febackendproject.DTO.PartialProductStockDTO;
import com.example.febackendproject.DTO.PricesDTO;
import com.example.febackendproject.Entity.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE p.name = ?1")
    Optional<Product> findProductByName(String name);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE Product SET disabled = ?2 WHERE id = ?1")
    void updateDisabled(Long productId, Boolean disabled);
    
    /////// SEARCHES BY CATEGORY
    
    @Query("SELECT p.id FROM Product p WHERE p.categoryId = ?1")
    List<Long> getIdByCategory(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.categoryId = ?1")
    Integer getProductAmountByCategory(Long id);
    
    /////// SEARCHES BY SUBCATEGORY
    
    @Query("SELECT p.id FROM Product p WHERE p.subcategoryId = ?1")
    List<Long> getIdBySubcategory(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.subcategoryId = ?1")
    Integer getProductAmountBySubcategory(Long id);
    
    /////// SEARCHES BY PROVIDER
    
    @Query("SELECT p.id FROM Product p WHERE p.providerId = ?1")
    List<Long> getIdByProvider(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.providerId = ?1")
    Integer getProductAmountByProvider(Long id);
    
    @Query("SELECT p FROM Product p WHERE p.providerId = ?1")
    List<Product> getProductByProviderId(Long id);
    
    /////// UTILS
    
    @Query("SELECT new com.example.febackendproject.DTO.MeasureDTO(p.measures, COUNT(p)) FROM Product p GROUP BY p.measures ORDER BY COUNT(p) DESC")
    List<MeasureDTO> getMeasures();
    
    @Query("SELECT new com.example.febackendproject.DTO.PricesDTO(MIN(p.measurePrice), MAX(p.measurePrice)) FROM Product p")
    PricesDTO getPrices();
    
}
