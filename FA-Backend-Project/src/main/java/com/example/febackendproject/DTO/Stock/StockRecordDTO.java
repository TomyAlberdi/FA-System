package com.example.febackendproject.DTO.Stock;

import com.example.febackendproject.Entity.StockRecord;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
