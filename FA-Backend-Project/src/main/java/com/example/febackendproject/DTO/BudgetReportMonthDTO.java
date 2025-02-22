package com.example.febackendproject.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BudgetReportMonthDTO {
    
    private String month;
    private Integer PENDIENTE;
    private Integer PAGO;
    private Integer ENVIADO;
    private Integer ENTREGADO;
    private Integer CANCELADO;
    
}
