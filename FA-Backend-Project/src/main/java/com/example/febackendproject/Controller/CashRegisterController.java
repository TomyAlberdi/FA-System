package com.example.febackendproject.Controller;

import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Service.CashRegisterService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/cash-register")
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @PostMapping
    public ResponseEntity<CashRegisterRecord> save(
            @RequestBody CashRegisterRecord record
    ) {
        CashRegisterRecord updatedRegister = cashRegisterService.addRecord(record);
        return ResponseEntity.ok(updatedRegister);
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotal() {
        return ResponseEntity.ok(cashRegisterService.getTotalAmount());
    }

    @GetMapping("/{date}")
    public ResponseEntity<List<CashRegisterRecord>> getByDate(@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return ResponseEntity.ok(cashRegisterService.getByDate(date));
    }

}
