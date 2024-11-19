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
    @Query("UPDATE Product SET " +
            "name = ?2, " +
            "disabled = ?3, " +
            "description = ?4, " +
            "quality = ?5, " +
            "providerId = ?6, " +
            "categoryId = ?7, " +
            "subcategoryId = ?8, " +
            "measureType = ?9, " +
            "measures = ?10, " +
            "measurePrice = ?11, " +
            "saleUnit = ?12, " +
            "saleUnitPrice = ?13, " +
            "measurePerSaleUnit = ?14, " +
            "discountPercentage = ?15, " +
            "discountedPrice = ?16," +
            "discountedMeasurePrice = ?17 " +
            "WHERE id = ?1")
    void updateById(Long id, String name, Boolean disabled, String description, String quality, Long providerId, Long categoryId, Long subcategoryId,
                    String measureType, String measures, Double measurePrice,
                    String salesUnit, Double saleUnitPrice, Double measurePerSaleUnit,
                    Integer discount_percentage, Double discount_new_price, Double discount_measure_price);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE Product SET disabled = ?2 WHERE id = ?1")
    void updateDisabled(Long productId, Boolean disabled);
    
    /////// SEARCHES BY CATEGORY
    
    @Query("SELECT p.id FROM Product p WHERE p.categoryId = ?1")
    List<Long> getIdByCategory(Long id);
    
    @Query("SELECT p.id FROM Product p WHERE p.subcategoryId = ?1")
    List<Long> getIdBySubcategory(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.categoryId = ?1")
    Integer getProductAmountByCategory(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.subcategoryId = ?1")
    Integer getProductAmountBySubcategory(Long id);
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialProductStockDTO(p.id, p.name, p.disabled, 0, p.measureType, p.measurePrice, p.saleUnit, p.measurePerSaleUnit, p.saleUnitPrice) FROM Product p WHERE p.categoryId = ?1")
    List<PartialProductStockDTO> getPartialProductStockByCategory(Long id);
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialProductStockDTO(p.id, p.name, p.disabled, 0, p.measureType, p.measurePrice, p.saleUnit, p.measurePerSaleUnit, p.saleUnitPrice) FROM Product p WHERE p.subcategoryId = ?1")
    List<PartialProductStockDTO> getPartialProductStockBySubcategory(Long id);
    
    /////// SEARCHES BY PROVIDER
    
    @Query("SELECT p.id FROM Product p WHERE p.providerId = ?1")
    List<Long> getIdByProvider(Long id);
    
    @Query("SELECT COUNT(p) AS amount FROM Product p WHERE p.providerId = ?1")
    Integer getProductAmountByProvider(Long id);
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialProductStockDTO(p.id, p.name, p.disabled, 0, p.measureType, p.measurePrice, p.saleUnit, p.measurePerSaleUnit, p.saleUnitPrice) FROM Product p WHERE p.providerId = ?1")
    List<PartialProductStockDTO> getPartialProductStockByProvider(Long id);
    
    /////// UTILS
    
    @Query("SELECT new com.example.febackendproject.DTO.MeasureDTO(p.measures, COUNT(p)) FROM Product p GROUP BY p.measures ORDER BY COUNT(p) DESC")
    List<MeasureDTO> getMeasures();
    
    @Query("SELECT new com.example.febackendproject.DTO.PricesDTO(MIN(p.measurePrice), MAX(p.measurePrice)) FROM Product p")
    PricesDTO getPrices();
    
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
