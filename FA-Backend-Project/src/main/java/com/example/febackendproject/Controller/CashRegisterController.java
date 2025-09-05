package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.CreateCashRegisterRecordDTO;
import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Service.CashRegisterService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@RequestMapping("/cash-register")
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @PostMapping
    public ResponseEntity<?> save(@RequestBody CreateCashRegisterRecordDTO dto) {
        CashRegisterRecord updatedRegister = cashRegisterService.addRecord(dto);
        return ResponseEntity.ok(updatedRegister);
    }

    @PutMapping
    public ResponseEntity<?> updateRecord(
            @RequestBody @Valid CreateCashRegisterRecordDTO dto,
            @RequestParam Long recordId
    ) {
        return ResponseEntity.ok(cashRegisterService.update(dto, recordId));
    }

    @GetMapping("/{date}")
    public ResponseEntity<List<CashRegisterRecord>> getByDate(@PathVariable @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return ResponseEntity.ok(cashRegisterService.getByDate(date));
    }

    @GetMapping("/total")
    public ResponseEntity<Double> getTotal() {
        return ResponseEntity.ok(cashRegisterService.getTotalAmount());
    }

    @GetMapping("/types/{yearMonth}")
    public ResponseEntity<Object> getTypes(@PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
        return ResponseEntity.ok(cashRegisterService.getTypes(yearMonth));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id) {
        cashRegisterService.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/last")
    public ResponseEntity<List<CashRegisterRecord>> getLast() {
        return ResponseEntity.ok(cashRegisterService.getLastRecords());
    }

}
