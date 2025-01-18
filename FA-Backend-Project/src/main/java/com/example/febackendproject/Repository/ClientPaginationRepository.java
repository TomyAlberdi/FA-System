package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PartialClientDTO;
import com.example.febackendproject.Entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientPaginationRepository extends PagingAndSortingRepository<Client, Long>, JpaSpecificationExecutor<Client> {
}
