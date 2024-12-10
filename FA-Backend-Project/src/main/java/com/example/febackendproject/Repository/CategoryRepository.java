package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Category;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    @Query("SELECT c FROM Category c WHERE c.name = ?1")
    Optional<Category> findByName(String name);
    
    @Modifying
    @Transactional
    @Query("UPDATE Category SET name=?1 WHERE id=?2")
    void updateById(String name, Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Category SET productsAmount = productsAmount + 1 WHERE id=?1")
    void incrementProductsAmount(Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Category SET productsAmount = productsAmount - 1 WHERE id = ?1")
    void decrementProductsAmount(Long id);
    
    @Query("SELECT c FROM Category c ORDER BY c.productsAmount DESC LIMIT 5")
    List<Category> listTopFiveByProductAmount();
    
}
