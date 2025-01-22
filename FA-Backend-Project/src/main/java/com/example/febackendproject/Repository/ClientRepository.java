package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PartialClientDTO;
import com.example.febackendproject.Entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    @Query("SELECT c FROM Client c WHERE c.name = ?1")
    Optional<Client> findByName(String name);
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialClientDTO(c.id, c.type, c.name) FROM Client c")
    List<PartialClientDTO> list();
    
    @Query("SELECT c.name FROM Client c WHERE c.id = ?1")
    String findNameById(Long id);
    
}
