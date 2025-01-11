package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PartialClientDTO;
import com.example.febackendproject.Entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientPaginationRepository extends PagingAndSortingRepository<Client, Long> {
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialClientDTO(c.id, c.type, c.name) FROM Client c")
    Page<PartialClientDTO> getPartialClients(Pageable pageable);
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialClientDTO(c.id, c.type, c.name) FROM Client c WHERE c.type = ?1")
    Page<PartialClientDTO> getPartialClientsByType(@Param("type") String type, Pageable pageable);
    
}
