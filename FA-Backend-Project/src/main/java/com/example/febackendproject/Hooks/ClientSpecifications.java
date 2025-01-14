package com.example.febackendproject.Hooks;

import com.example.febackendproject.Entity.Client;
import org.springframework.data.jpa.domain.Specification;

public class ClientSpecifications {
    
    public static Specification<Client> type(String type) {
        return (root, query, builder) -> type == null ? builder.conjunction() : builder.equal(root.get("type"), type);
    }
    
    public static Specification<Client> hasKeyword(String keyword) {
        return (root, query, builder) -> {
            if (keyword == null || keyword.trim().isEmpty() ) {
                return builder.conjunction();
            }
            String likePattern = "%" + keyword + "%";
            return builder.or(
                    builder.like(builder.lower(root.get("name")), likePattern),
                    builder.like(builder.lower(root.get("cuitDni")), likePattern)
            );
        };
    }
    
}
