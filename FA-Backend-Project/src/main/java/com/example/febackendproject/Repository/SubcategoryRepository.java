package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Subcategory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    
    @Query("SELECT s FROM Subcategory s WHERE s.categoryId = ?1")
    List<Subcategory> findByCategoryId(Long categoryId);
    
    @Query("SELECT s FROM Subcategory s WHERE s.name = ?1")
    Optional<Subcategory> findByName(String name);
    
    @Modifying
    @Transactional
    @Query("UPDATE Subcategory SET name=?1 WHERE id=?2")
    void updateById(String name, Long id);
    
}
