package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Repository.CashRegisterRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;

    public CashRegisterRecord addRecord(CashRegisterRecord record) {
        return cashRegisterRepository.save(record);
    }

    public List<CashRegisterRecord> getByDate(LocalDate date) {
        return cashRegisterRepository.getByDate(date);
    }

    public Double getTotalAmount() {
        return cashRegisterRepository.getTotalAmount();
    }

}
