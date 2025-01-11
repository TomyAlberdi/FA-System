package com.example.febackendproject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Provider {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @NotBlank
    @Column(unique = true)
    private String name;
    
    private String locality;
    private String address;
    private String phone;
    private String email;
    private String cuit;
    private Integer productsDiscount = 0;
    
    @Column(name = "products_amount")
    private int productsAmount = 0;
    
}
