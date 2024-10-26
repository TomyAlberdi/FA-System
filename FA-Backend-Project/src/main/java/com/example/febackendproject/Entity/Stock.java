package com.example.febackendproject.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table
@AllArgsConstructor
@NoArgsConstructor
public class Stock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    
    @Column(name = "product_id")
    @NotNull
    private Long productId;
    
    @Column(name = "product_name")
    private String productName;
    
    @Column
    private Integer quantity = 0;
    
    @ElementCollection
    @CollectionTable(name = "stock_records", joinColumns = @JoinColumn(name = "stock_id"))
    private List<StockRecord> stockRecords;
    
}
