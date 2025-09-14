package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.Stock.PartialStockDTO;
import com.example.febackendproject.Entity.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StockPaginationRepository extends PagingAndSortingRepository<Stock, Long>, JpaSpecificationExecutor<Stock> {
    
    @Query("SELECT new com.example.febackendproject.DTO.Stock.PartialStockDTO(s.id, s.productId, s.productName, s.productSaleUnit, s.quantity, s.productImage) FROM Stock s")
    Page<PartialStockDTO> listStocks(Pageable pageable);
    
    @Query("SELECT new com.example.febackendproject.DTO.Stock.PartialStockDTO(s.id, s.productId, s.productName, s.productSaleUnit, s.quantity, s.productImage) " +
            "FROM Stock s " +
            "WHERE LOWER(CAST(s.productId AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.productName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<PartialStockDTO> listStocksByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
}
