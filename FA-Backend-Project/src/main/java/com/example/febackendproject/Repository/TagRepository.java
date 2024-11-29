package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    
    @Query("SELECT c FROM Tag c WHERE c.tagKey = ?1 AND c.value = ?1")
    Optional<Tag> find(String key, String value);
    
    @Query("SELECT c.tagKey FROM Tag c GROUP BY c.tagKey")
    List<String> listKeys();
    
    @Query("SELECT c.value FROM Tag c WHERE c.tagKey = ?1")
    List<String> listValuesByKey(String key);
    
    @Query("SELECT EXISTS (SELECT 1 FROM Tag WHERE value = ?1) AS value_exists")
    Boolean existsByValue(String value);
    
    @Query("SELECT EXISTS (SELECT 1 FROM Tag WHERE tagKey = ?1) AS key_exists")
    Boolean existsByKey(String key);
    
    @Query("SELECT t.id FROM Tag t WHERE t.id IN :ids")
    List<Long> findExistingIds(List<Long> ids);
    
    @Query("SELECT t FROM Tag t WHERE t.id IN :ids")
    List<Tag> findValidIds(List<Long> ids);
    
}
