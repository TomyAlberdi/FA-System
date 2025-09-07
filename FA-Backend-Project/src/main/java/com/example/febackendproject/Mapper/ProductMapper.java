package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.CharacteristicDTO;
import com.example.febackendproject.DTO.Product.CompleteProductDTO;
import com.example.febackendproject.DTO.Product.CreateProductDTO;
import com.example.febackendproject.DTO.Product.PartialProductDTO;
import com.example.febackendproject.Entity.Product;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

public class ProductMapper {
    
    public static Product createProduct(CreateProductDTO dto) {
        Product product = new Product();
        updateProduct(product, dto);
        return product;
    }
    
    public static CompleteProductDTO createCompleteProduct(
            Product product,
            Double measureUnitCost,
            Double saleUnitCost,
            Double saleUnitPrice,
            String category,
            String subcategory,
            String provider,
            Integer stock,
            List<CharacteristicDTO> characteristics
    ) {
        CompleteProductDTO dto = new CompleteProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setCode(product.getCode());
        dto.setDisabled(product.getDisabled());
        dto.setDescription(product.getDescription());
        dto.setQuality(product.getQuality());
        dto.setMeasureType(product.getMeasureType());
        dto.setMeasures(product.getMeasures());
        dto.setMeasurePrice(product.getMeasurePrice());
        dto.setMeasureUnitCost(measureUnitCost);
        dto.setSaleUnit(product.getSaleUnit());
        dto.setSaleUnitCost(saleUnitCost);
        dto.setSaleUnitPrice(saleUnitPrice);
        dto.setMeasurePerSaleUnit(product.getMeasurePerSaleUnit());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setDiscountedPrice(product.getDiscountedPrice());
        dto.setDiscountedMeasurePrice(product.getDiscountedMeasurePrice());
        dto.setImages(product.getImages());
        dto.setCategory(category);
        dto.setCategoryId(product.getCategoryId());
        dto.setSubcategory(subcategory);
        dto.setSubcategoryId(product.getSubcategoryId());
        dto.setProvider(provider);
        dto.setProviderId(product.getProviderId());
        dto.setStock(stock);
        dto.setCharacteristics(characteristics);
        return dto;
    }
    
    public static void updateProduct(Product product, CreateProductDTO dto) {
        double parsedSaleUnitPrice = dto.getSaleUnitPrice();
        double measurePrice = 0.0;
        if (dto.getSaleUnit().equals(dto.getMeasureType())) {
            dto.setMeasurePerSaleUnit(1.0);
            measurePrice = truncateToTwoDecimals(parsedSaleUnitPrice);
        } else if (dto.getMeasurePerSaleUnit() > 0) {
            measurePrice = truncateToTwoDecimals(parsedSaleUnitPrice / dto.getMeasurePerSaleUnit());
        }
        double discountedPrice = 0.0;
        double discountedMeasurePrice = 0.0;
        if (dto.getDiscountPercentage() > 0) {
            double discountFactor = 1 - (dto.getDiscountPercentage() / 100.0);
            discountedPrice = truncateToTwoDecimals(parsedSaleUnitPrice * discountFactor);
            discountedMeasurePrice = truncateToTwoDecimals(measurePrice * discountFactor);
        }
        String mainImage = dto.getImages().isEmpty() ? "" : dto.getImages().get(0);
        product.setCode(dto.getCode());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setQuality(dto.getQuality());
        product.setMainImage(mainImage);
        product.setImages(dto.getImages());
        product.setProviderId(dto.getProviderId());
        product.setCategoryId(dto.getCategoryId());
        product.setSubcategoryId(dto.getSubcategoryId());
        product.setMeasureType(dto.getMeasureType());
        product.setMeasures(dto.getMeasures());
        product.setMeasurePrice(measurePrice);
        product.setSaleUnit(dto.getSaleUnit());
        product.setSaleUnitCost(dto.getSaleUnitCost().toString());
        product.setMeasureUnitCost(dto.getMeasureUnitCost().toString());
        product.setSaleUnitPrice(dto.getSaleUnitPrice().toString());
        product.setMeasurePerSaleUnit(dto.getMeasurePerSaleUnit());
        product.setDiscountPercentage(dto.getDiscountPercentage());
        product.setDiscountedPrice(discountedPrice);
        product.setDiscountedMeasurePrice(discountedMeasurePrice);
        product.setColor(dto.getColor());
        product.setOrigen(dto.getOrigen());
        product.setBorde(dto.getBorde());
        product.setAspecto(dto.getAspecto());
        product.setTextura(dto.getTextura());
        product.setTransito(dto.getTransito());
    }
    
    public static PartialProductDTO createPartialProduct(Product product) {
        PartialProductDTO dto = new PartialProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDisabled(product.getDisabled());
        dto.setMeasureType(product.getMeasureType());
        dto.setMeasurePrice(product.getMeasurePrice());
        dto.setSaleUnit(product.getSaleUnit());
        dto.setSaleUnitPrice(product.getSaleUnitPrice());
        dto.setMeasurePerSaleUnit(product.getMeasurePerSaleUnit());
        dto.setDiscountPercentage(product.getDiscountPercentage());
        dto.setDiscountedPrice(product.getDiscountedPrice());
        dto.setDiscountedMeasurePrice(product.getDiscountedMeasurePrice());
        dto.setImage(product.getImages().get(0));
        return dto;
    }
    
    private static double truncateToTwoDecimals(double value) {
        return BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.FLOOR) // Truncate without rounding
                .doubleValue();
    }
    
    public static List<CharacteristicDTO> createCharacteristics(
            String color,
            String origen,
            String borde,
            String aspecto,
            String textura,
            String transito
    ) {
        List<CharacteristicDTO> characteristics = new ArrayList<>();
        if (color != null && !color.isEmpty()) {
            characteristics.add(new CharacteristicDTO("Color", color));
        }
        if (origen != null && !origen.isEmpty()) {
            characteristics.add(new CharacteristicDTO("Origen", origen));
        }
        if (borde != null && !borde.isEmpty()) {
            characteristics.add(new CharacteristicDTO("Borde", borde));
        }
        if (aspecto != null && !aspecto.isEmpty()) {
            characteristics.add(new CharacteristicDTO("Aspecto", aspecto));
        }
        if (textura != null && !textura.isEmpty()) {
            characteristics.add(new CharacteristicDTO("Textura", textura));
        }
        if (transito != null && !transito.isEmpty()) {
            characteristics.add(new CharacteristicDTO("Tránsito", transito));
        }
        return characteristics;
    }
    
}
