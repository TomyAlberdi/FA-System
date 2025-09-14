package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Provider;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    
    @Query("SELECT p FROM Provider p WHERE p.name = ?1")
    Optional<Provider> findByName(String name);
    
    @Query("SELECT p.productsDiscount FROM Provider p WHERE p.id = ?1")
    Integer getProductsDiscount(Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider SET productsDiscount = ?1 WHERE id = ?2")
    void updateProductsDiscount(Integer productsDiscount, Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider SET productsAmount = productsAmount + 1 WHERE id=?1")
    void incrementProductsAmount(Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider SET productsAmount = productsAmount - 1 WHERE id = ?1")
    void decrementProductsAmount(Long id);
    
    @Query("SELECT p FROM Provider p ORDER BY p.productsAmount DESC LIMIT 5")
    List<Provider> listTopFiveByProductAmount();
    
}