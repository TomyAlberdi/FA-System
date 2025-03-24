package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.LightCashRegisterDTO;
import com.example.febackendproject.Entity.CashRegister;
import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Service.CashRegisterService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/cash-register")
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @GetMapping()
    public ResponseEntity<List<LightCashRegisterDTO>> getByMonth(@RequestParam(value = "yearMonth", required = false) String yearMonthStr) {
        YearMonth yearMonth = (yearMonthStr != null && !yearMonthStr.isEmpty())
                ? YearMonth.parse(yearMonthStr)
                : YearMonth.now();
        List<LightCashRegisterDTO> cashRegisterList = cashRegisterService.getByMonth(yearMonth);
        return ResponseEntity.ok(cashRegisterList);
    }

    @PostMapping("/{date}/records")
    public ResponseEntity<CashRegister> save(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
            @RequestBody CashRegisterRecord record
    ) {
        CashRegister updatedRegister = cashRegisterService.addRecord(record, date);
        return ResponseEntity.ok(updatedRegister);
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotal() {
        return ResponseEntity.ok(cashRegisterService.getTotalAmount());
    }

}
