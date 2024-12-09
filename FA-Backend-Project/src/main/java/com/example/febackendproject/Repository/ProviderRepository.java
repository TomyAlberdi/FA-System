package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Provider;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    
    @Query("SELECT p FROM Provider p WHERE p.name = ?1")
    Optional<Provider> findByName(String name);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider SET name=?2, locality=?3, address=?4, phone=?5, email=?6, cuit=?7 WHERE id=?1")
    void updateById(Long id, String name, String locality, String address, String phone, String email, String cuit);
    
    @Query("SELECT p.productsDiscount FROM Provider p WHERE p.id = ?1")
    Integer getProductsDiscount(Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Provider SET productsDiscount = ?1 WHERE id = ?2")
    void updateProductsDiscount(Integer productsDiscount, Long id);
    
}