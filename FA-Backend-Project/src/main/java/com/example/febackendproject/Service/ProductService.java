package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.CompleteProductDTO;
import com.example.febackendproject.DTO.FilterDTO;
import com.example.febackendproject.DTO.PartialProductDTO;
import com.example.febackendproject.DTO.PartialProductStockDTO;
import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Hooks.ProductSpecifications;
import com.example.febackendproject.Repository.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductPaginationRepository productPaginationRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final ProviderRepository providerRepository;
    private final StockRepository stockRepository;
    
    public Page<PartialProductDTO> getPaginatedPartialProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productPaginationRepository.getPartialProducts(pageable);
    }
    
    public Product save(Product product) {
        if (product.getSaleUnit().equals(product.getMeasureType())) {
            product.setMeasurePerSaleUnit(1.0);
            product.setMeasurePrice(truncateToTwoDecimals(product.getSaleUnitPrice()));
        } else if (product.getMeasurePerSaleUnit() > 0) {
            double measurePrice = product.getSaleUnitPrice() / product.getMeasurePerSaleUnit();
            product.setMeasurePrice(truncateToTwoDecimals(measurePrice));
        }
        if (product.getDiscountPercentage() > 0) {
            double discountFactor = 1 - (product.getDiscountPercentage() / 100.0);
            double discountedPrice = product.getSaleUnitPrice() * discountFactor;
            double discountedMeasurePrice = product.getMeasurePrice() * discountFactor;
            product.setDiscountedPrice(truncateToTwoDecimals(discountedPrice));
            product.setDiscountedMeasurePrice(truncateToTwoDecimals(discountedMeasurePrice));
        } else {
            product.setDiscountedPrice(0.0);
            product.setDiscountedMeasurePrice(0.0);
        }
        if (!product.getImages().isEmpty()) {
            product.setMainImage(product.getImages().get(0));
        } else {
            product.setMainImage("");
        }
        return productRepository.save(product);
    }
    
    private double truncateToTwoDecimals(double value) {
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.FLOOR) // Truncate without rounding
                .doubleValue();
    }
    
    public Optional<CompleteProductDTO> getById(Long id) {
        CompleteProductDTO returnProduct = new CompleteProductDTO();
        if (productRepository.existsById(id)) {
            Optional<Product> product = productRepository.findById(id);
            returnProduct.setId(product.get().getId());
            returnProduct.setName(product.get().getName());
            returnProduct.setDisabled(product.get().getDisabled());
            returnProduct.setDescription(product.get().getDescription());
            returnProduct.setQuality(product.get().getQuality());
            
            returnProduct.setMeasureType(product.get().getMeasureType());
            returnProduct.setMeasures(product.get().getMeasures());
            returnProduct.setMeasurePrice(product.get().getMeasurePrice());
            
            returnProduct.setSaleUnit(product.get().getSaleUnit());
            returnProduct.setSaleUnitPrice(product.get().getSaleUnitPrice());
            returnProduct.setMeasurePerSaleUnit(product.get().getMeasurePerSaleUnit());
            
            returnProduct.setDiscountPercentage(product.get().getDiscountPercentage());
            returnProduct.setDiscountedPrice(product.get().getDiscountedPrice());
            returnProduct.setDiscountedMeasurePrice(product.get().getDiscountedMeasurePrice());
            
            returnProduct.setImages(product.get().getImages());
            
            returnProduct.setCategoryId(product.get().getCategoryId());
            String category = categoryRepository.findById(product.get().getCategoryId()).get().getName();
            returnProduct.setCategory(category);
            
            returnProduct.setSubcategoryId(product.get().getSubcategoryId());
            String subcategory = subcategoryRepository.findById(product.get().getSubcategoryId()).get().getName();
            returnProduct.setSubcategory(subcategory);
            
            returnProduct.setProviderId(product.get().getProviderId());
            String provider = providerRepository.findById(product.get().getProviderId()).get().getName();
            returnProduct.setProvider(provider);
            
            Integer stock = stockRepository.getQuantityByProductId(product.get().getId());
            returnProduct.setStock(stock);
            
            returnProduct.setColor(product.get().getColor());
            returnProduct.setOrigen(product.get().getOrigen());
            returnProduct.setBorde(product.get().getBorde());
            returnProduct.setAspecto(product.get().getAspecto());
            returnProduct.setTextura(product.get().getTextura());
            returnProduct.setTransito(product.get().getTransito());

        }
        return Optional.of(returnProduct);
    }
    
    public Page<PartialProductStockDTO> getPartialProductStockByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductStockDTO> partialProductStockDTOPage = productPaginationRepository.getPartialProductStockByCategoryId(categoryId, pageable);
        List<PartialProductStockDTO> partialProductStockDTOList = partialProductStockDTOPage.getContent().stream().toList();
        if (partialProductStockDTOList.isEmpty()) {
            return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
        }
        partialProductStockDTOList.forEach((prod) -> {
            prod.setStock(stockRepository.getQuantityByProductId(prod.getId()));
        });
        return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
    }

    public Page<PartialProductStockDTO> getPartialProductStockBySubcategory(Long subcategoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductStockDTO> partialProductStockDTOPage = productPaginationRepository.getPartialProductStockBySubcategoryId(subcategoryId, pageable);
        List<PartialProductStockDTO> partialProductStockDTOList = partialProductStockDTOPage.getContent().stream().toList();
        if (partialProductStockDTOList.isEmpty()) {
            return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
        }
        partialProductStockDTOList.forEach((prod) -> {
            prod.setStock(stockRepository.getQuantityByProductId(prod.getId()));
        });
        return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
    }
    
    public Page<PartialProductStockDTO> getPartialProductStockByProvider(Long providerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductStockDTO> partialProductStockDTOPage = productPaginationRepository.getPartialProductStockByProviderId(providerId, pageable);
        List<PartialProductStockDTO> partialProductStockDTOList = partialProductStockDTOPage.getContent().stream().toList();
        if (partialProductStockDTOList.isEmpty()) {
            return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
        }
        partialProductStockDTOList.forEach((prod) -> {
            prod.setStock(stockRepository.getQuantityByProductId(prod.getId()));
        });
        return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
    }
    
    public Boolean existByName(String name) {
        Optional<Product> searchProduct = productRepository.findProductByName(name);
        return searchProduct.isPresent();
    }
    
    public Boolean existById(Long id) {
        return productRepository.existsById(id);
    }
    
    public void deleteById(Long id) {
        productRepository.deleteById(id);
        stockRepository.deleteByProductId(id);
    }
    
    public Optional<List<String>> getProductImages(Long productId) {
        return productRepository.findById(productId).map(Product::getImages);
    }
    
    public Optional<Product> updateDisabled(Long productId, Boolean disabled) {
        productRepository.updateDisabled(productId, disabled);
        return productRepository.findById(productId);
    }
    
    public Page<PartialProductDTO> getFilteredPartialProducts(FilterDTO filterDTO, int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasSubcategory(filterDTO.getSubcategoryId()))
                .and(ProductSpecifications.hasProvider(filterDTO.getProviderId()))
                .and(ProductSpecifications.hasMeasure(filterDTO.getMeasures()))
                .and(ProductSpecifications.priceBetween(filterDTO.getMinPrice(), filterDTO.getMaxPrice()))
                .and(ProductSpecifications.hasDiscount(filterDTO.getDiscount()))
                .and(ProductSpecifications.isDiscontinued(filterDTO.getDiscontinued()))
                .and(ProductSpecifications.hasKeyword(filterDTO.getKeyword()));
        
        return productPaginationRepository.findAll(spec, pageable).map(product -> {
                return new PartialProductDTO(
                        product.getId(),
                        product.getName(),
                        product.getDisabled(),
                        product.getMeasureType(),
                        product.getMeasurePrice(),
                        product.getSaleUnit(),
                        product.getSaleUnitPrice(),
                        product.getMeasurePerSaleUnit(),
                        product.getDiscountPercentage(),
                        product.getDiscountedPrice(),
                        product.getDiscountedMeasurePrice(),
                        product.getMainImage());
        });
    }
    
}
