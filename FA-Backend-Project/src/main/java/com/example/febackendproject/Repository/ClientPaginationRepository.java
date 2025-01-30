package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Client;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientPaginationRepository extends PagingAndSortingRepository<Client, Long>, JpaSpecificationExecutor<Client> {
}
