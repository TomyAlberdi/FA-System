package com.example.febackendproject.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class StockRecord {
    
    @Column(name = "record_type")
    private String recordType;
    
    @Column(name = "quantity_change")
    private Integer stockChange;

    @Column(name = "record_date")
    private LocalDateTime recordDate;
    
}
