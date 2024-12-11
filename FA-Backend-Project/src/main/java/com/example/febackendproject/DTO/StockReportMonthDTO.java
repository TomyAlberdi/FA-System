package com.example.febackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockReportMonthDTO {
    
    private String month;
    private Integer IN;
    private Integer OUT;
    
}
