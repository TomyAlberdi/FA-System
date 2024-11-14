package com.example.febackendproject.Hooks;

import com.example.febackendproject.Entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {
    
    public static Specification<Product> hasSubcategory(Long subcategoryId) {
        return (root, query, builder) -> subcategoryId == null ? builder.conjunction() : builder.equal(root.get("subcategoryId"), subcategoryId);
    }
    
    public static Specification<Product> hasProvider(Long providerId) {
        return (root, query, builder) -> providerId == null ? builder.conjunction() : builder.equal(root.get("providerId"), providerId);
    }
    
    public static Specification<Product> hasMeasure(String measure) {
        return (root, query, builder) -> {
            if (measure == null || measure.isEmpty()) {
                return builder.conjunction();
            }
            // Trim and ignore case for a more resilient filter
            return builder.equal(builder.lower(builder.trim(root.get("measures"))), measure.toLowerCase().trim());
        };
    }
    
    public static Specification<Product> priceBetween(Double minPrice, Double maxPrice) {
        return (root, query, builder) -> {
            if (minPrice == null && maxPrice == null) {
                return builder.conjunction();
            } else if (minPrice != null && maxPrice != null) {
                return builder.between(root.get("measurePrice"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return builder.greaterThanOrEqualTo(root.get("measurePrice"), minPrice);
            } else {
                return builder.lessThanOrEqualTo(root.get("measurePrice"), maxPrice);
            }
        };
    }
    
    public static Specification<Product> hasDiscount(Boolean discount) {
        return (root, query, builder) -> discount == null ? builder.conjunction() : builder.equal(root.get("discountPercentage"), discount ? 1 : 0);
    }
    
}
