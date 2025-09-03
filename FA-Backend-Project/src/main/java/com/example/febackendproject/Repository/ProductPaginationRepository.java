package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.Product.PartialProductDTO;
import com.example.febackendproject.DTO.Product.PartialProductStockDTO;
import com.example.febackendproject.Entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

@Repository
public interface ProductPaginationRepository extends PagingAndSortingRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @Query("SELECT new com.example.febackendproject.DTO.Product.PartialProductDTO(p.id, p.name, p.disabled, p.measureType, p.measurePrice, p.saleUnit, p.saleUnitPrice, p.measurePerSaleUnit, p.discountPercentage, p.discountedPrice,p.discountedMeasurePrice, p.mainImage) FROM Product p")
    Page<PartialProductDTO> getPartialProducts(Pageable pageable);
    
    @Query("SELECT new com.example.febackendproject.DTO.Product.PartialProductStockDTO(p.id, p.name, p.disabled, 0, p.measureType, p.saleUnit, p.measurePerSaleUnit, p.saleUnitPrice, p.discountPercentage, p.discountedPrice) FROM Product p WHERE p.categoryId = :categoryId")
    Page<PartialProductStockDTO> getPartialProductStockByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);
    
    @Query("SELECT new com.example.febackendproject.DTO.Product.PartialProductStockDTO(p.id, p.name, p.disabled, 0, p.measureType, p.saleUnit, p.measurePerSaleUnit, p.saleUnitPrice, p.discountPercentage, p.discountedPrice) FROM Product p WHERE p.subcategoryId = :subcategoryId")
    Page<PartialProductStockDTO> getPartialProductStockBySubcategoryId(@Param("subcategoryId") Long subcategoryId, Pageable pageable);
    
    @Query("SELECT new com.example.febackendproject.DTO.Product.PartialProductStockDTO(p.id, p.name, p.disabled, 0, p.measureType, p.saleUnit, p.measurePerSaleUnit, p.saleUnitPrice, p.discountPercentage, p.discountedPrice) FROM Product p WHERE p.providerId = :providerId")
    Page<PartialProductStockDTO> getPartialProductStockByProviderId(@Param("providerId") Long providerId, Pageable pageable);
    
}
