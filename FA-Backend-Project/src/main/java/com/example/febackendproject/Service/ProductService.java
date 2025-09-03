package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.*;
import com.example.febackendproject.DTO.Product.CompleteProductDTO;
import com.example.febackendproject.DTO.Product.CreateProductDTO;
import com.example.febackendproject.DTO.Product.PartialProductDTO;
import com.example.febackendproject.DTO.Product.PartialProductStockDTO;
import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Hooks.ProductSpecifications;
import com.example.febackendproject.Mapper.ProductMapper;
import com.example.febackendproject.Repository.*;
import jakarta.transaction.Transactional;
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
    private final ProviderService providerService;
    private final CategoryService categoryService;
    private final SubcategoryService subcategoryService;
    
    public Page<PartialProductDTO> getPaginatedPartialProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productPaginationRepository.getPartialProducts(pageable);
    }
    
    @Transactional
    public Product save(CreateProductDTO dto) {
        categoryService.assertCategoryExists(dto.getCategoryId());
        subcategoryService.assertSubcategoryExists(dto.getSubcategoryId());
        providerService.assertProviderExists(dto.getProviderId());
        Product product = ProductMapper.createProduct(dto);
        categoryRepository.incrementProductsAmount(dto.getCategoryId());
        subcategoryRepository.incrementProductsAmount(dto.getSubcategoryId());
        providerRepository.incrementProductsAmount(dto.getProviderId());
        //FIXME update after refactoring stock service
        
        //        if (newProduct.getImages().isEmpty()) {
        //            Stock newStock = stockService.save(newProduct.getId(), newProduct.getName(), "", newProduct.getSaleUnit(), newProduct.getMeasureType(), newProduct.getMeasurePerSaleUnit());
        //        } else {
        //            Stock newStock = stockService.save(newProduct.getId(), newProduct.getName(), newProduct.getImages().get(0), newProduct.getSaleUnit(), newProduct.getMeasureType(), newProduct.getMeasurePerSaleUnit());
        //        }
        return productRepository.save(product);
    }
    
    @Transactional
    public Product updateById(CreateProductDTO dto, Long id) {
        Optional<Product> search = productRepository.findById(id);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Producto con ID " + id + " no encontrado.");
        }
        Product product = search.get();
        // Update categories amounts
        categoryService.assertCategoryExists(dto.getCategoryId());
        categoryRepository.decrementProductsAmount(product.getCategoryId());
        categoryRepository.incrementProductsAmount(dto.getCategoryId());
        // Update subcategories amounts
        subcategoryService.assertSubcategoryExists(dto.getSubcategoryId());
        subcategoryRepository.decrementProductsAmount(product.getSubcategoryId());
        subcategoryRepository.incrementProductsAmount(dto.getSubcategoryId());
        // Update provider amounts
        providerService.assertProviderExists(dto.getProviderId());
        providerRepository.decrementProductsAmount(product.getProviderId());
        providerRepository.incrementProductsAmount(dto.getProviderId());
        
        ProductMapper.updateProduct(product, dto);
        return productRepository.save(product);
    }
    
    public CompleteProductDTO getById(Long id) {
        Optional<Product> search = productRepository.findById(id);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Producto con ID " + id + " no encontrado.");
        }
        Product product = search.get();
        double parsedMeasureUnitCost = 0.0;
        if (product.getMeasureUnitCost() != null) {
            parsedMeasureUnitCost = Double.parseDouble(product.getMeasureUnitCost());
        }
        double parsedSaleUnitCost = 0.0;
        if (product.getSaleUnitCost() != null) {
            parsedSaleUnitCost = Double.parseDouble(product.getSaleUnitCost());
        }
        double parsedSaleUnitPrice = 0.0;
        if (product.getSaleUnitPrice() != null) {
            parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
        }
        String category = categoryService.findById(product.getCategoryId()).getName();
        String subcategory = subcategoryService.findById(product.getSubcategoryId()).getName();
        String provider = providerService.findById(product.getProviderId()).getName();
        Integer stock = stockRepository.getQuantityByProductId(product.getId());
        List<CharacteristicDTO> characteristics = ProductMapper.createCharacteristics(product.getColor(), product.getOrigen(), product.getBorde(), product.getAspecto(), product.getTextura(), product.getTransito());
        return ProductMapper.createCompleteProduct(product, parsedMeasureUnitCost, parsedSaleUnitCost, parsedSaleUnitPrice, category, subcategory, provider, stock, characteristics);
    }
    
    public Page<PartialProductStockDTO> getPartialProductStockByCategory(Long categoryId, int page, int size) {
        categoryService.assertCategoryExists(categoryId);
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductStockDTO> partialProductStockDTOPage = productPaginationRepository.getPartialProductStockByCategoryId(categoryId, pageable);
        List<PartialProductStockDTO> partialProductStockDTOList = partialProductStockDTOPage.getContent().stream().toList();
        if (partialProductStockDTOList.isEmpty()) {
            return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
        }
        partialProductStockDTOList.forEach((prod) -> prod.setStock(stockRepository.getQuantityByProductId(prod.getId())));
        return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
    }

    public Page<PartialProductStockDTO> getPartialProductStockBySubcategory(Long subcategoryId, int page, int size) {
        subcategoryService.assertSubcategoryExists(subcategoryId);
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductStockDTO> partialProductStockDTOPage = productPaginationRepository.getPartialProductStockBySubcategoryId(subcategoryId, pageable);
        List<PartialProductStockDTO> partialProductStockDTOList = partialProductStockDTOPage.getContent().stream().toList();
        if (partialProductStockDTOList.isEmpty()) {
            return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
        }
        partialProductStockDTOList.forEach((prod) -> prod.setStock(stockRepository.getQuantityByProductId(prod.getId())));
        return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
    }
    
    public Page<PartialProductStockDTO> getPartialProductStockByProvider(Long providerId, int page, int size) {
        providerService.assertProviderExists(providerId);
        Pageable pageable = PageRequest.of(page, size);
        Page<PartialProductStockDTO> partialProductStockDTOPage = productPaginationRepository.getPartialProductStockByProviderId(providerId, pageable);
        List<PartialProductStockDTO> partialProductStockDTOList = partialProductStockDTOPage.getContent().stream().toList();
        if (partialProductStockDTOList.isEmpty()) {
            return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
        }
        partialProductStockDTOList.forEach((prod) -> prod.setStock(stockRepository.getQuantityByProductId(prod.getId())));
        return new PageImpl<>(partialProductStockDTOList, pageable, partialProductStockDTOPage.getTotalElements());
    }
    
    public void assertProductExists(Long id) {
        if (productRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Producto con ID " + id + " no encontrado.");
        }
    }
    
    //FIXME check if usages can be delegated to repository
    public Boolean existById(Long id) {
        return productRepository.existsById(id);
    }
    
    @Transactional
    public void deleteById(Long id) {
        Optional<Product> search = productRepository.findById(id);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Producto con ID " + id + " no encontrado.");
        }
        Product product = search.get();
        categoryRepository.decrementProductsAmount(product.getCategoryId());
        subcategoryRepository.decrementProductsAmount(product.getSubcategoryId());
        providerRepository.decrementProductsAmount(product.getProviderId());
        productRepository.deleteById(id);
        stockRepository.deleteByProductId(id);
    }
    
    @Transactional
    public void updateDisabled(Long productId, Boolean disabled) {
        assertProductExists(productId);
        productRepository.updateDisabled(productId, disabled);
    }
    
    public Page<PartialProductDTO> getFilteredPartialProducts(FilterProductDTO filterProductDTO, int page, int size) {
        subcategoryService.assertSubcategoryExists(filterProductDTO.getSubcategoryId());
        providerService.assertProviderExists(filterProductDTO.getProviderId());
        Pageable pageable = PageRequest.of(page, size);
        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasSubcategory(filterProductDTO.getSubcategoryId()))
                .and(ProductSpecifications.hasProvider(filterProductDTO.getProviderId()))
                .and(ProductSpecifications.hasMeasure(filterProductDTO.getMeasures()))
                .and(ProductSpecifications.priceBetween(filterProductDTO.getMinPrice(), filterProductDTO.getMaxPrice()))
                .and(ProductSpecifications.hasDiscount(filterProductDTO.getDiscount()))
                .and(ProductSpecifications.isDiscontinued(filterProductDTO.getDiscontinued()))
                .and(ProductSpecifications.hasKeyword(filterProductDTO.getKeyword()));
        
        return productPaginationRepository.findAll(spec, pageable).map(ProductMapper::createPartialProduct);
    }
    //FIXME refactor discount & price change by provider
//    public void increasePriceByProvider(Integer percentage, Long providerId) {
//        List<Product> products = productRepository.getProductByProviderId(providerId);
//        products.forEach(product -> {
//            double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
//            double updatedPrice = truncateToTwoDecimals(parsedSaleUnitPrice * (1 + percentage / 100.0));
//            product.setSaleUnitPrice(String.valueOf(updatedPrice));
//            if (product.getSaleUnit().equals(product.getMeasureType())) {
//                product.setMeasurePrice(updatedPrice);
//            } else {
//                double updatedMeasurePrice = truncateToTwoDecimals(updatedPrice / product.getMeasurePerSaleUnit());
//                product.setMeasurePrice(updatedMeasurePrice);
//            }
//            System.out.println("New Measure Price " + product.getMeasurePrice());
//        });
//        productRepository.saveAll(products);
//    }
//
//    public void reducePriceByProvider(Integer percentage, Long providerId) {
//        List<Product> products = productRepository.getProductByProviderId(providerId);
//        products.forEach(product -> {
//            double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
//            double reduceFactor = 1 - (percentage / 100.0);
//            double updatedPrice = truncateToTwoDecimals(parsedSaleUnitPrice * reduceFactor);
//            product.setSaleUnitPrice(String.valueOf(updatedPrice));
//            if (product.getSaleUnit().equals(product.getMeasureType())) {
//                product.setMeasurePrice(updatedPrice);
//            } else {
//                double updatedMeasurePrice = truncateToTwoDecimals(updatedPrice / product.getMeasurePerSaleUnit());
//                product.setMeasurePrice(updatedMeasurePrice);
//            }
//        });
//        productRepository.saveAll(products);
//    }
//
//    public void applyDiscountByProvider(Integer percentage, Long providerId) {
//        List<Product> products = productRepository.getProductByProviderId(providerId);
//        Integer currentDiscount = providerRepository.getProductsDiscount(providerId);
//        products.forEach(product -> {
//            double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
//            double discountDifference = product.getDiscountPercentage() - currentDiscount;
//            double finalDiscount = Math.abs(discountDifference + (currentDiscount + percentage));
//
//            double discountFactor = 1 - (finalDiscount / 100.0);
//
//            double discountedPrice = parsedSaleUnitPrice * discountFactor;
//            double discountedMeasurePrice = product.getMeasurePrice() * discountFactor;
//
//            System.out.println("Old discount: " + product.getDiscountPercentage());
//            System.out.println("New discount: " + finalDiscount);
//
//            product.setDiscountPercentage((int) finalDiscount);
//            product.setDiscountedPrice(truncateToTwoDecimals(discountedPrice));
//            product.setDiscountedMeasurePrice(truncateToTwoDecimals(discountedMeasurePrice));
//        });
//        providerRepository.updateProductsDiscount(percentage,providerId);
//        productRepository.saveAll(products);
//    }
//
//    public void removeDiscountByProvider(Integer percentage, Long providerId) {
//        List<Product> products = productRepository.getProductByProviderId(providerId);
//        Integer currentDiscount = providerRepository.getProductsDiscount(providerId);
//        if (currentDiscount != null && currentDiscount >= percentage) {
//            products.forEach(product -> {
//                if (product.getDiscountPercentage() < percentage) {
//                   double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
//                   double discountDifference = product.getDiscountPercentage() - currentDiscount;
//                   double finalDiscount = Math.abs(discountDifference + (currentDiscount - percentage));
//                   double discountFactor = 1 - (finalDiscount / 100.0);
//
//                   double discountedPrice = parsedSaleUnitPrice * discountFactor;
//                   double discountedMeasurePrice = product.getMeasurePrice() * discountFactor;
//
//                    System.out.println("Old discount: " + product.getDiscountPercentage());
//                    System.out.println("New discount: " + finalDiscount);
//
//                   product.setDiscountPercentage((int) finalDiscount);
//                   product.setDiscountedPrice(truncateToTwoDecimals(discountedPrice));
//                   product.setDiscountedMeasurePrice(truncateToTwoDecimals(discountedMeasurePrice));
//                }
//            });
//        }
//        providerRepository.updateProductsDiscount(percentage,providerId);
//        productRepository.saveAll(products);
//    }
    
    public long getTotalProducts() {
        return productRepository.count();
    }
    
}
