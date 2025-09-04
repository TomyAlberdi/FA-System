package com.example.febackendproject.DTO;

import com.example.febackendproject.Entity.CashRegisterRecord;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateCashRegisterRecordDTO {

    private LocalDate date;
    private CashRegisterRecord.Type type;
    private Double amount;
    private String detail;

}
