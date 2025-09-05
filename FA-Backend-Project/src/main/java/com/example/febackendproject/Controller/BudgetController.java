package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.Budget.CreateBudgetDTO;
import com.example.febackendproject.DTO.Budget.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Service.BudgetService;
import com.example.febackendproject.Service.ClientService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/budget")
public class BudgetController {

    public final BudgetService budgetService;
    public final ClientService clientService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getBudgetByClientId(@PathVariable("clientId") Long clientId) {
        clientService.assertClientExists(clientId);
        return ResponseEntity.ok(budgetService.getByClientId(clientId));
    }

    @PostMapping
    public ResponseEntity<?> createBudget(
            @RequestBody @Valid CreateBudgetDTO dto,
            @RequestParam(required = false) Long clientId
    ) {
        return ResponseEntity.ok(budgetService.save(dto, clientId));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBudgetStatus(
            @PathVariable Long id,
            @RequestParam(value = "status") Budget.Status status
    ) {
        List<String> unavailableProducts = budgetService.updateStatus(id, status);
        if (unavailableProducts.isEmpty()) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(unavailableProducts);
        }
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<?> getBudgetByDate(@PathVariable LocalDate date) {
        return ResponseEntity.ok(budgetService.getByDate(date));
    }
    
    @GetMapping("/range")
    public ResponseEntity<?> getBudgetByRange(
            @RequestParam(value = "start") LocalDate start,
            @RequestParam(value = "end") LocalDate end
    ) {
        return ResponseEntity.ok(budgetService.getByDateRange(start, end));
    }

    @PutMapping
    public ResponseEntity<?> updateBudget(
            @RequestBody @Valid CreateBudgetDTO dto,
            @RequestParam(required = false) Long clientId,
            @RequestParam Long budgetId
    ) {
        return ResponseEntity.ok(budgetService.update(dto, clientId, budgetId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/lastBudgets")
    public ResponseEntity<?> getLastBudgets() {
        return ResponseEntity.ok(budgetService.getLastBudgets());
    }
    
    @GetMapping("/report")
    public ResponseEntity<?> getReportBudgets() {
        return ResponseEntity.ok(budgetService.getReportBudget());
    }

}
