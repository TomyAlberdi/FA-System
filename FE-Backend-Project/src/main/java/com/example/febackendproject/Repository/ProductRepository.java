package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.CompleteProductDTO;
import com.example.febackendproject.DTO.MeasureDTO;
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
    
    @Query("SELECT p.id FROM Product p WHERE p.categoryId = ?1")
    List<Long> getIdByCategory(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.categoryId = ?1")
    Integer getProductAmountByCategory(Long id);
    
    @Query("SELECT p.id FROM Product p WHERE p.providerId = ?1")
    List<Long> getIdByProvider(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.providerId = ?1")
    Integer getProductAmountByProvider(Long id);
    
    @Query("SELECT new com.example.febackendproject.DTO.MeasureDTO(p.measures, COUNT(p)) FROM Product p GROUP BY p.measures ORDER BY COUNT(p) DESC")
    List<MeasureDTO> getMeasures();
    
    @Query("SELECT new com.example.febackendproject.DTO.PricesDTO(MIN(p.price), MAX(p.price)) FROM Product p")
    PricesDTO getPrices();
    
    @Modifying
    @Transactional
    @Query("UPDATE Product SET " +
            "name = ?1, " +
            "description = ?2, " +
            "categoryId = ?3, " +
            "providerId = ?4, " +
            "discountPercentage = ?5, " +
            "discountedPrice = ?6, " +
            "measures = ?7, " +
            "unitPerBox = ?8, " +
            "priceSaleUnit = ?9, " +
            "saleUnit = ?10, " +
            "price = ?11, " +
            "quality = ?12 " +
            "WHERE id = ?13")
    void updateById(String name, String description, Long categoryId, Long providerId, Integer discount_percentage,
                      Double discount_new_price, String measures, Double m2PerBox, Double priceUnit,
                      String salesUnit, Double price, String quality, Long id);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM product_images WHERE product_id = ?1", nativeQuery = true)
    void deleteImagesById(Long code);
    
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO product_images (product_id, images) VALUES (?2, ?1)", nativeQuery = true)
    void insertImageById(String image, Long id);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM product_tags WHERE product_id = ?1", nativeQuery = true)
    void deleteTagsById(Long code);
    
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO product_tags (product_id, tags) VALUES (?2, ?1)", nativeQuery = true)
    void insertTagById(String tag, Long id);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM product WHERE category_id = ?1", nativeQuery = true)
    void deleteByCategoryId(Long id);
    
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM product WHERE provider_id = ?1", nativeQuery = true)
    void deleteByProviderId(Long id);
    
}
