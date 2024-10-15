package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.*;
import com.example.febackendproject.Entity.Category;
import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Entity.Provider;
import com.example.febackendproject.Repository.CategoryRepository;
import com.example.febackendproject.Repository.ProductPaginationRepository;
import com.example.febackendproject.Repository.ProductRepository;
import com.example.febackendproject.Repository.ProviderRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductPaginationRepository productPaginationRepository;
    private final CategoryRepository categoryRepository;
    private final ProviderRepository providerRepository;
    
    private CompleteProductDTO convertDTO(Product product) {
        CompleteProductDTO completeProductDTO = new CompleteProductDTO();
        completeProductDTO.setId(product.getId());
        completeProductDTO.setName(product.getName());
        completeProductDTO.setDescription(product.getDescription());
        completeProductDTO.setPrice(product.getPrice());
        completeProductDTO.setMeasures(product.getMeasures());
        completeProductDTO.setPriceSaleUnit(product.getPriceSaleUnit());
        completeProductDTO.setUnitPerBox(product.getUnitPerBox());
        completeProductDTO.setQuality(product.getQuality());
        completeProductDTO.setDiscountPercentage(product.getDiscountPercentage());
        completeProductDTO.setDiscountedPrice(product.getDiscountedPrice());
        
        Optional<Category> category = categoryRepository.findById(product.getCategoryId());
        if (category.isPresent()) {
            completeProductDTO.setCategory(category.get().getName());
        } else {
            completeProductDTO.setCategory(null);
        }
        
        Optional<Provider> provider = providerRepository.findById(product.getProviderId());
        if (provider.isPresent()) {
            completeProductDTO.setProvider(provider.get().getName());
        } else {
            completeProductDTO.setProvider(null);
        }
        
        /*
        Optional<List<String>> images = this.getProductImages(product.getId());
        if (images.isPresent()) {
            completeProductDTO.setImages(images.get());
        } else {
            completeProductDTO.setImages(null);
        }
        */
        completeProductDTO.setImages(product.getImages());
        
        /*
        Optional<List<String>> tags = this.getProductTags(product.getId());
        if (tags.isPresent()) {
            completeProductDTO.setTags(tags.get());
        } else {
            completeProductDTO.setTags(null);
        }
        */
        completeProductDTO.setTags(product.getTags());
        return completeProductDTO;
        
    }
    
    private PartialProductDTO convertPartialDTO(Product product) {
        PartialProductDTO partialProductDTO = new PartialProductDTO();
        partialProductDTO.setId(product.getId());
        partialProductDTO.setName(product.getName());
        partialProductDTO.setPrice(product.getPrice());
        partialProductDTO.setSalesUnit(product.getSaleUnit());
        partialProductDTO.setPriceSaleUnit(product.getPriceSaleUnit());
        partialProductDTO.setDiscountPercentage(product.getDiscountPercentage());
        partialProductDTO.setDiscountedPrice(product.getDiscountedPrice());
        partialProductDTO.setImage(product.getImages().get(0));
        return partialProductDTO;
    }
    
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
            returnProduct.setPrice(product.get().getPrice());
            returnProduct.setMeasures(product.get().getMeasures());
            returnProduct.setSaleUnit(product.get().getSaleUnit());
            returnProduct.setPriceSaleUnit(product.get().getPriceSaleUnit());
            returnProduct.setUnitPerBox(product.get().getUnitPerBox());
            returnProduct.setQuality(product.get().getQuality());
            returnProduct.setDiscountPercentage(product.get().getDiscountPercentage());
            returnProduct.setDiscountedPrice(product.get().getDiscountedPrice());
            returnProduct.setImages(product.get().getImages());
            returnProduct.setTags(product.get().getTags());
            
            String category = categoryRepository.findById(product.get().getCategoryId()).get().getName();
            returnProduct.setCategory(category);
            
            String provider = providerRepository.findById(product.get().getProviderId()).get().getName();
            returnProduct.setProvider(provider);
        }
        return Optional.of(returnProduct);
    }
    
    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }
    
    public void updateProduct(Product product) {
        productRepository.deleteImagesById(product.getId());
        productRepository.deleteTagsById(product.getId());
        productRepository.updateById(product.getName(), product.getDescription(), product.getCategoryId(), product.getProviderId(), product.getDiscountPercentage(), product.getDiscountedPrice(), product.getMeasures(), product.getUnitPerBox(), product.getPriceSaleUnit(), product.getSaleUnit(), product.getPrice(), product.getQuality(), product.getId());
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
        }
    }
    
    public void deleteProductByProviderId(Long providerId) {
        List<Long> listProductsByProvider = productRepository.getIdByProvider(providerId);
        for (Long id : listProductsByProvider) {
            productRepository.deleteById(id);
        }
    }
    
    /*
    public Page<PartialProductDTO> getFilteredPartialProducts(FilterDTO filterDTO, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        Specification<Product> spec = Specification.where(ProductSpecifications.hasCategory(filterDTO.getCategoryId()))
                .and(ProductSpecifications.hasProvider(filterDTO.getProviderId()))
                .and(ProductSpecifications.hasMeasure(filterDTO.getMeasure()))
                .and(ProductSpecifications.priceBetween(filterDTO.getMinPrice(), filterDTO.getMaxPrice()))
                .and(ProductSpecifications.hasDiscount(filterDTO.getDiscount()));
        
        return productPaginationRepository.findAll(spec, pageable).map(product -> {
            List<String> images = product.getImages();
            String firstImage = (images != null && !images.isEmpty()) ? images.get(0) : null;
            
            return new PartialProductDTO(
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    product.getSaleUnit(),
                    product.getPriceSaleUnit(),
                    product.getDiscountPercentage(),
                    product.getDiscountedPrice(),
                    firstImage
            );
        });
    }
    */
}
