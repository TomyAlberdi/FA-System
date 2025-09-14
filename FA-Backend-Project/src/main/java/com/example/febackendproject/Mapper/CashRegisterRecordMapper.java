package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.CreateCashRegisterRecordDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.CashRegisterRecord;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CashRegisterRecordMapper {

    public static CashRegisterRecord createRecord(CreateCashRegisterRecordDTO dto) {
        CashRegisterRecord record = new CashRegisterRecord();
        updateRecord(record, dto);
        return record;
    }

    public static void updateRecord(CashRegisterRecord record, CreateCashRegisterRecordDTO dto) {
        record.setDate(dto.getDate());
        record.setAmount(dto.getAmount());
        record.setType(dto.getType());
        record.setDetail(dto.getDetail());
    }

    public static CreateCashRegisterRecordDTO createDTO(Budget budget) {
        CreateCashRegisterRecordDTO dto = new CreateCashRegisterRecordDTO();
        LocalDate today = LocalDate.now();
        today.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        dto.setDate(today);
        dto.setType(CashRegisterRecord.Type.INGRESO);
        dto.setAmount(budget.getFinalAmount());
        dto.setDetail("PRESUPUESTO " + budget.getId());
        return dto;
    }

}
