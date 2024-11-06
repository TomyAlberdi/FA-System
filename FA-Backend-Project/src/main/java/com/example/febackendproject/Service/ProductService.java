package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.*;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Hooks.ProductSpecifications;
import com.example.febackendproject.Repository.*;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
    
    public Boolean searchKeys(Long categoryId, Long providerId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
        Optional<Provider> provider = providerRepository.findById(providerId);
        return category.isPresent() && provider.isPresent();
    }
    
    public Page<PartialProductDTO> getPaginatedPartialProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductDTO> partialProductDTOPage = productPaginationRepository.getPartialProducts(pageable);
        
        List<PartialProductDTO> PartialProductDTOList = partialProductDTOPage.getContent().stream().toList();
        
        for (PartialProductDTO PartialProductDTO : PartialProductDTOList) {
            Optional<List<String>> images = this.getProductImages(PartialProductDTO.getId());
            images.ifPresent(strings -> {
                if (!strings.isEmpty()) {
                    PartialProductDTO.setImage(strings.get(0));
                } else {
                    PartialProductDTO.setImage(null);
                }
            });
        }
        return new PageImpl<>(PartialProductDTOList, pageable, partialProductDTOPage.getTotalElements());
    }
    
    public Page<PartialProductDTO> searchProductsByKeyword(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductDTO> partialProductDTOPage = productPaginationRepository.getPartialProductsByKeyword(keyword, pageable);
        List<PartialProductDTO> PartialProductDTOList = partialProductDTOPage.getContent().stream().toList();
        return new PageImpl<>(PartialProductDTOList, pageable, partialProductDTOPage.getTotalElements());
    }
    
    public Product add(Product product) {
        return productRepository.save(product);
    }
    
    public Optional<CompleteProductDTO> getById(Long id) {
        Optional<Product> product = productRepository.findById(id);
        CompleteProductDTO returnProduct = new CompleteProductDTO();
        if (product.isPresent()) {
            returnProduct.setId(product.get().getId());
            returnProduct.setName(product.get().getName());
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
            
            returnProduct.setImages(product.get().getImages());
            returnProduct.setTags(product.get().getTags());
            
            String category = categoryRepository.findById(product.get().getCategoryId()).get().getName();
            returnProduct.setCategory(category);
            
            String subcategory = subcategoryRepository.findById(product.get().getSubcategoryId()).get().getName();
            returnProduct.setSubcategory(subcategory);
            
            String provider = providerRepository.findById(product.get().getProviderId()).get().getName();
            returnProduct.setProvider(provider);
            
            Integer stock = stockRepository.getQuantityByProductId(product.get().getId());
            returnProduct.setStock(stock);
        }
        return Optional.of(returnProduct);
    }
    
    public List<PartialProductStockDTO> getPartialProductStockByCategory(Long categoryId) {
        List<PartialProductStockDTO> noStockList = productRepository.getPartialProductStockByCategory(categoryId);
        if (noStockList.isEmpty()) {
            return noStockList;
        }
        noStockList.forEach((prod) -> {
            prod.setStock(stockRepository.getQuantityByProductId(prod.getId()));
        });
        return noStockList;
    }

    public List<PartialProductStockDTO> getPartialProductStockBySubcategory(Long subcategoryId) {
        List<PartialProductStockDTO> noStockList = productRepository.getPartialProductStockBySubcategory(subcategoryId);
        if (noStockList.isEmpty()) {
            return noStockList;
        }
        noStockList.forEach((prod) -> {
            prod.setStock(stockRepository.getQuantityByProductId(prod.getId()));
        });
        return noStockList;
    }
    
    public List<PartialProductStockDTO> getPartialProductStockByProvider(Long providerId) {
        List<PartialProductStockDTO> noStockList = productRepository.getPartialProductStockByProvider(providerId);
        if (noStockList.isEmpty()) {
            return noStockList;
        }
        noStockList.forEach((prod) -> {
            prod.setStock(stockRepository.getQuantityByProductId(prod.getId()));
        });
        return noStockList;
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
    }
    
    public void updateProduct(Product product) {
        productRepository.deleteImagesById(product.getId());
        productRepository.deleteTagsById(product.getId());
        productRepository.updateById(product.getId(), product.getName(), product.getDescription(), product.getQuality(), product.getProviderId(), product.getCategoryId(), product.getSubcategoryId(), product.getMeasureType(), product.getMeasures(), product.getMeasurePrice(), product.getSaleUnit(), product.getSaleUnitPrice(), product.getMeasurePerSaleUnit(), product.getDiscountPercentage(), product.getDiscountedPrice());
        for (String tag : product.getTags()) {
            productRepository.insertTagById(tag, product.getId());
        }
        for (String image : product.getImages()) {
            productRepository.insertImageById(image, product.getId());
        }
    }
    
    public Optional<List<String>> getProductTags(Long productId) {
        return productRepository.findById(productId).map(Product::getTags);
    }
    
    public Optional<List<String>> getProductImages(Long productId) {
        return productRepository.findById(productId).map(Product::getImages);
    }
    
    public void deleteProductByCategoryId(Long categoryId) {
        List<Long> listProductsByCategory = productRepository.getIdByCategory(categoryId);
        for (Long id : listProductsByCategory) {
            productRepository.deleteById(id);
            stockRepository.deleteByProductId(id);
        }
    }
    
    public void deleteProductByProviderId(Long providerId) {
        List<Long> listProductsByProvider = productRepository.getIdByProvider(providerId);
        for (Long id : listProductsByProvider) {
            stockRepository.deleteByProductId(id);
            productRepository.deleteById(id);
        }
    }
    
    public Page<PartialProductDTO> getFilteredPartialProducts(FilterDTO filterDTO, int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Specification<Product> spec = Specification.where(ProductSpecifications.hasCategory(filterDTO.getCategoryId())
                        .and(ProductSpecifications.hasProvider(filterDTO.getProviderId()))
                        .and(ProductSpecifications.hasMeasure(filterDTO.getMeasure()))
                        .and(ProductSpecifications.priceBetween(filterDTO.getMinPrice(), filterDTO.getMaxPrice()))
                        .and(ProductSpecifications.hasDiscount(filterDTO.getDiscount())));
        
        return productPaginationRepository.findAll(spec, pageable).map(product -> {
                String image = !product.getImages().isEmpty() ? product.getImages().get(0) : null;
                return new PartialProductDTO(product.getId(), product.getName(), product.getMeasureType(), product.getMeasurePrice(), product.getDiscountPercentage(), product.getDiscountedPrice(), image);
        });
    }
    
}
