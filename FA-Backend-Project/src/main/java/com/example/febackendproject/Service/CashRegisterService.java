package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.CreateCashRegisterRecordDTO;
import com.example.febackendproject.DTO.PricesDTO;
import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Mapper.CashRegisterRecordMapper;
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

    public CashRegisterRecord addRecord(CreateCashRegisterRecordDTO dto) {
        CashRegisterRecord record = CashRegisterRecordMapper.createRecord(dto);
        return cashRegisterRepository.save(record);
    }

    public CashRegisterRecord update(CreateCashRegisterRecordDTO dto, Long recordId) {
        Optional<CashRegisterRecord> search = cashRegisterRepository.findById(recordId);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("Registro con ID " + recordId + " no encontrado.");
        }
        CashRegisterRecord record = search.get();
        CashRegisterRecordMapper.updateRecord(record, dto);
        return cashRegisterRepository.save(record);
    }

    public List<CashRegisterRecord> getByDate(LocalDate date) {
        return cashRegisterRepository.getByDate(date);
    }

    public void assertCashRegisterRecordExists(Long id) {
        if (!cashRegisterRepository.existsById(id)) {
            throw new ResourceNotFoundException("El registro con ID " + id + " no existe.");
        }
    }

    public Double getTotalAmount() {
        return cashRegisterRepository.getTotalAmount();
    }

    public Object getTypes(YearMonth yearMonth) { return cashRegisterRepository.getTypes(yearMonth); }
    
    public void deleteById(Long id) {
        assertCashRegisterRecordExists(id);
        cashRegisterRepository.deleteById(id);
    }
    
    public List<CashRegisterRecord> getLastRecords() {
        return cashRegisterRepository.getLastRecords();
    }

}
