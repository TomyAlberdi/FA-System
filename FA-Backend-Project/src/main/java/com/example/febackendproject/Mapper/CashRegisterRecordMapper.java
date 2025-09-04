package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.CreateCashRegisterRecordDTO;
import com.example.febackendproject.Entity.CashRegisterRecord;

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

}
