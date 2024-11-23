package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.ProductCharacteristic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCharacteristicRepository extends JpaRepository<Long, ProductCharacteristic> {
    
    @Query("SELECT c.key FROM ProductCharacteristic c")
    List<String> listKeys();
    
    @Query("SELECT c.value FROM ProductCharacteristic c WHERE c.key = ?1")
    List<String> listValuesByKey(String key);
    
    @Query("SELECT EXISTS (SELECT 1 FROM ProductCharacteristic WHERE value = ?1) AS value_exists")
    Boolean existsByValue(String value);
    
    @Query("SELECT EXISTS (SELECT 1 FROM ProductCharacteristic WHERE key = ?1) AS key_exists")
    Boolean existsByKey(String key);
    
}
