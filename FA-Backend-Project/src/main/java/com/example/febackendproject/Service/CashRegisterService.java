package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.LightCashRegisterDTO;
import com.example.febackendproject.Entity.CashRegister;
import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Repository.CashRegisterRepository;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;

    public CashRegister addRecord(CashRegisterRecord record, LocalDate date) {
        CashRegister cashRegister = cashRegisterRepository.getByDate(date).orElseGet(() -> new CashRegister(null, 0.0, date, new ArrayList<>()));
        cashRegister.getRecords().add(record);
        if (record.getType().equals(CashRegisterRecord.Type.INGRESO)) {
            cashRegister.setTotal(cashRegister.getTotal() + record.getAmount());
        } else {
            cashRegister.setTotal(cashRegister.getTotal() - record.getAmount());
        }
        return cashRegisterRepository.save(cashRegister);
    }

    public List<LightCashRegisterDTO> getByMonth(YearMonth month) {
        return cashRegisterRepository.getByMonth(month);
    }

    public Double getTotalAmount() {
        return cashRegisterRepository.getTotalAmount();
    }

}
