package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.*;
import com.example.febackendproject.Entity.Product;
import com.example.febackendproject.Hooks.ProductSpecifications;
import com.example.febackendproject.Repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
    
    public Page<PartialProductDTO> getPaginatedPartialProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productPaginationRepository.getPartialProducts(pageable);
    }
    
    public Product save(Product product) {
        double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
        if (product.getSaleUnit().equals(product.getMeasureType())) {
            product.setMeasurePerSaleUnit(1.0);
            product.setMeasurePrice(truncateToTwoDecimals(parsedSaleUnitPrice));
        }
        else if (product.getMeasurePerSaleUnit() > 0) {
            double measurePrice = parsedSaleUnitPrice / product.getMeasurePerSaleUnit();
            product.setMeasurePrice(truncateToTwoDecimals(measurePrice));
        }
        if (product.getDiscountPercentage() > 0) {
            double discountFactor = 1 - (product.getDiscountPercentage() / 100.0);
            double discountedPrice = parsedSaleUnitPrice * discountFactor;
            double discountedMeasurePrice = product.getMeasurePrice() * discountFactor;
            product.setDiscountedPrice(truncateToTwoDecimals(discountedPrice));
            product.setDiscountedMeasurePrice(truncateToTwoDecimals(discountedMeasurePrice));
        }
        else {
            product.setDiscountedPrice(0.0);
            product.setDiscountedMeasurePrice(0.0);
        }
        if (!product.getImages().isEmpty()) {
            product.setMainImage(product.getImages().get(0));
        }
        else {
            product.setMainImage("");
        }
        if (product.getId() != null) {
            Optional<Product> oldProduct = productRepository.findById(product.getId());
            if (oldProduct.isPresent()) {
                if (!Objects.equals(product.getCategoryId(), oldProduct.get().getCategoryId())) {
                    if (oldProduct.get().getCategoryId() != null) {
                        categoryRepository.decrementProductsAmount(oldProduct.get().getCategoryId());
                    }
                    if (product.getCategoryId() != null) {
                        categoryRepository.incrementProductsAmount(product.getCategoryId());
                    }
                }
                if (!Objects.equals(product.getSubcategoryId(), oldProduct.get().getSubcategoryId())) {
                    if (oldProduct.get().getSubcategoryId() != null) {
                        subcategoryRepository.decrementProductsAmount(oldProduct.get().getSubcategoryId());
                    }
                    if (product.getSubcategoryId() != null) {
                        subcategoryRepository.incrementProductsAmount(product.getSubcategoryId());
                    }
                }
                if (!Objects.equals(product.getProviderId(), oldProduct.get().getProviderId())) {
                    if (oldProduct.get().getProviderId() != null) {
                        providerRepository.decrementProductsAmount(oldProduct.get().getProviderId());
                    }
                    if (product.getProviderId() != null) {
                        providerRepository.incrementProductsAmount(product.getProviderId());
                    }
                }
            } else {
                throw new IllegalArgumentException("Product with ID " + product.getId() + " does not exist.");
            }
        }
        else {
            if (product.getCategoryId() != null) {
                categoryRepository.incrementProductsAmount(product.getCategoryId());
            }
            if (product.getSubcategoryId() != null) {
                subcategoryRepository.incrementProductsAmount(product.getSubcategoryId());
            }
            if (product.getProviderId() != null) {
                providerRepository.incrementProductsAmount(product.getProviderId());
            }
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
            returnProduct.setCode(product.get().getCode());
            returnProduct.setDisabled(product.get().getDisabled());
            returnProduct.setDescription(product.get().getDescription());
            returnProduct.setQuality(product.get().getQuality());
            
            returnProduct.setMeasureType(product.get().getMeasureType());
            returnProduct.setMeasures(product.get().getMeasures());
            returnProduct.setMeasurePrice(product.get().getMeasurePrice());
            
            returnProduct.setSaleUnit(product.get().getSaleUnit());
            double parsedSaleUnitCost = 0.0;
            if (product.get().getSaleUnitCost() != null) {
                parsedSaleUnitCost = Double.parseDouble(product.get().getSaleUnitCost());
            }
            returnProduct.setSaleUnitCost(parsedSaleUnitCost);
            double parsedSaleUnitPrice = 0.0;
            if (product.get().getSaleUnitPrice() != null) {
                parsedSaleUnitPrice = Double.parseDouble(product.get().getSaleUnitPrice());
            }
            returnProduct.setSaleUnitPrice(parsedSaleUnitPrice);
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
            
            List<CharacteristicDTO> characteristics = new ArrayList<>();
            String color = product.get().getColor();
            if (color != null && !color.isEmpty()) {
                characteristics.add(new CharacteristicDTO("Color", color));
            }
            String origen = product.get().getOrigen();
            if (origen != null && !origen.isEmpty()) {
                characteristics.add(new CharacteristicDTO("Origen", origen));
            }
            String borde = product.get().getBorde();
            if (borde != null && !borde.isEmpty()) {
                characteristics.add(new CharacteristicDTO("Borde", borde));
            }
            String aspecto  = product.get().getAspecto();
            if (aspecto != null && !aspecto.isEmpty()) {
                characteristics.add(new CharacteristicDTO("Aspecto", aspecto));
            }
            String textura = product.get().getTextura();
            if (textura != null && !textura.isEmpty()) {
                characteristics.add(new CharacteristicDTO("Textura", textura));
            }
            String transito = product.get().getTransito();
            if (transito != null && !transito.isEmpty()) {
                characteristics.add(new CharacteristicDTO("Tránsito", transito));
            }
            returnProduct.setCharacteristics(characteristics);

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
    
    @Transactional
    public void deleteById(Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();
            if (product.getCategoryId() != null) {
                categoryRepository.decrementProductsAmount(product.getCategoryId());
            }
            if (product.getSubcategoryId() != null) {
                subcategoryRepository.decrementProductsAmount(product.getSubcategoryId());
            }
            if (product.getProviderId() != null) {
                providerRepository.decrementProductsAmount(product.getProviderId());
            }
            productRepository.deleteById(id);
            stockRepository.deleteByProductId(id);
        } else {
            throw new IllegalArgumentException("Product with ID " + id + " does not exist.");
        }
    }
    public Optional<Product> updateDisabled(Long productId, Boolean disabled) {
        productRepository.updateDisabled(productId, disabled);
        return productRepository.findById(productId);
    }
    
    public Page<PartialProductDTO> getFilteredPartialProducts(FilterProductDTO filterProductDTO, int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasSubcategory(filterProductDTO.getSubcategoryId()))
                .and(ProductSpecifications.hasProvider(filterProductDTO.getProviderId()))
                .and(ProductSpecifications.hasMeasure(filterProductDTO.getMeasures()))
                .and(ProductSpecifications.priceBetween(filterProductDTO.getMinPrice(), filterProductDTO.getMaxPrice()))
                .and(ProductSpecifications.hasDiscount(filterProductDTO.getDiscount()))
                .and(ProductSpecifications.isDiscontinued(filterProductDTO.getDiscontinued()))
                .and(ProductSpecifications.hasKeyword(filterProductDTO.getKeyword()));
        
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
    
    public void increasePriceByProvider(Integer percentage, Long providerId) {
        List<Product> products = productRepository.getProductByProviderId(providerId);
        products.forEach(product -> {
            double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
            double updatedPrice = truncateToTwoDecimals(parsedSaleUnitPrice * (1 + percentage / 100.0));
            product.setSaleUnitPrice(String.valueOf(updatedPrice));
            if (product.getSaleUnit().equals(product.getMeasureType())) {
                product.setMeasurePrice(updatedPrice);
            } else {
                double updatedMeasurePrice = truncateToTwoDecimals(updatedPrice / product.getMeasurePerSaleUnit());
                product.setMeasurePrice(updatedMeasurePrice);
            }
            System.out.println("New Measure Price " + product.getMeasurePrice());
        });
        productRepository.saveAll(products);
    }
    
    public void reducePriceByProvider(Integer percentage, Long providerId) {
        List<Product> products = productRepository.getProductByProviderId(providerId);
        products.forEach(product -> {
            double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
            double reduceFactor = 1 - (percentage / 100.0);
            double updatedPrice = truncateToTwoDecimals(parsedSaleUnitPrice * reduceFactor);
            product.setSaleUnitPrice(String.valueOf(updatedPrice));
            if (product.getSaleUnit().equals(product.getMeasureType())) {
                product.setMeasurePrice(updatedPrice);
            } else {
                double updatedMeasurePrice = truncateToTwoDecimals(updatedPrice / product.getMeasurePerSaleUnit());
                product.setMeasurePrice(updatedMeasurePrice);
            }
        });
        productRepository.saveAll(products);
    }
    
    public void applyDiscountByProvider(Integer percentage, Long providerId) {
        List<Product> products = productRepository.getProductByProviderId(providerId);
        Integer currentDiscount = providerRepository.getProductsDiscount(providerId);
        products.forEach(product -> {
            double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
            double discountDifference = product.getDiscountPercentage() - currentDiscount;
            double finalDiscount = Math.abs(discountDifference + (currentDiscount + percentage));
            
            double discountFactor = 1 - (finalDiscount / 100.0);
            
            double discountedPrice = parsedSaleUnitPrice * discountFactor;
            double discountedMeasurePrice = product.getMeasurePrice() * discountFactor;
            
            System.out.println("Old discount: " + product.getDiscountPercentage());
            System.out.println("New discount: " + finalDiscount);
            
            product.setDiscountPercentage((int) finalDiscount);
            product.setDiscountedPrice(truncateToTwoDecimals(discountedPrice));
            product.setDiscountedMeasurePrice(truncateToTwoDecimals(discountedMeasurePrice));
        });
        providerRepository.updateProductsDiscount(percentage,providerId);
        productRepository.saveAll(products);
    }
    
    public void removeDiscountByProvider(Integer percentage, Long providerId) {
        List<Product> products = productRepository.getProductByProviderId(providerId);
        Integer currentDiscount = providerRepository.getProductsDiscount(providerId);
        if (currentDiscount != null && currentDiscount >= percentage) {
            products.forEach(product -> {
                if (product.getDiscountPercentage() < percentage) {
                   double parsedSaleUnitPrice = Double.parseDouble(product.getSaleUnitPrice());
                   double discountDifference = product.getDiscountPercentage() - currentDiscount;
                   double finalDiscount = Math.abs(discountDifference + (currentDiscount - percentage));
                   double discountFactor = 1 - (finalDiscount / 100.0);
                   
                   double discountedPrice = parsedSaleUnitPrice * discountFactor;
                   double discountedMeasurePrice = product.getMeasurePrice() * discountFactor;
                    
                    System.out.println("Old discount: " + product.getDiscountPercentage());
                    System.out.println("New discount: " + finalDiscount);
                    
                   product.setDiscountPercentage((int) finalDiscount);
                   product.setDiscountedPrice(truncateToTwoDecimals(discountedPrice));
                   product.setDiscountedMeasurePrice(truncateToTwoDecimals(discountedMeasurePrice));
                }
            });
        }
        providerRepository.updateProductsDiscount(percentage,providerId);
        productRepository.saveAll(products);
    }
    
    public long getTotalProducts() {
        return productRepository.count();
    }
    
}
