package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.PartialBudgetDTO;
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
import java.util.Optional;

@AllArgsConstructor
@RestController
@RestControllerAdvice
@Validated
@RequestMapping("/budget")
public class BudgetController {

    public final BudgetService budgetService;
    public final ClientService clientService;

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Budget>> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getById(id));
    }
    
    @PatchMapping("/{id}")
    public ResponseEntity<Optional<List<String>>> updateBudgetStatus(
            @PathVariable Long id,
            @RequestParam(value = "status") Budget.Status status
    ) {
        if (budgetService.existsById(id)) {
            Optional<List<String>> unavailableProducts = budgetService.updateStatus(status, id);
            if (unavailableProducts.isPresent() && !unavailableProducts.get().isEmpty()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(unavailableProducts);
            } else {
                return ResponseEntity.ok(unavailableProducts);
            }
        }
        return ResponseEntity.notFound().build();
    }
    

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<PartialBudgetDTO>> getBudgetByClientId(@PathVariable("clientId") Long clientId) {
        if (clientService.existsById(clientId)) {
            return ResponseEntity.ok(budgetService.getByClientId(clientId));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<PartialBudgetDTO>> getBudgetByDate(@PathVariable LocalDate date) {
        return ResponseEntity.ok(budgetService.getByDate(date));
    }
    
    @GetMapping("/range")
    public ResponseEntity<List<PartialBudgetDTO>> getBudgetByRange(
            @RequestParam(value = "start") LocalDate start,
            @RequestParam(value = "end") LocalDate end
    ) {
        return ResponseEntity.ok(budgetService.getByDateRange(start, end));
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody @Valid Budget budget) {
        if (clientService.existsById(b udget.getClientId())) {
            return ResponseEntity.ok(budgetService.save(budget));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PatchMapping
    public ResponseEntity<Budget> updateBudget(@RequestBody @Valid Budget budget) {
        return ResponseEntity.ok(budgetService.update(budget));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/lastBudgets")
    public ResponseEntity<List<PartialBudgetDTO>> getLastBudgets() {
        return ResponseEntity.ok(budgetService.getLastBudgets());
    }
    
    @GetMapping("/report")
    public ResponseEntity<?> getReportBudgets() {
        return ResponseEntity.ok(budgetService.getReportBudget());
    }

}
