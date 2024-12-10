package com.example.febackendproject.DTO;

import com.example.febackendproject.Entity.Stock;
import com.example.febackendproject.Entity.StockRecord;
import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.SqlResultSetMapping;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockRecordDTO {
    
    private Long productId;
    private String productName;
    private String productSaleUnit;
    private StockRecord record;

}
