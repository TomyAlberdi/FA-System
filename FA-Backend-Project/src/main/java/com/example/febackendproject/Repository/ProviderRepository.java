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
    @Query("UPDATE Provider SET name=?1 WHERE id=?2")
    void updateById(String name, Long id);
    
}