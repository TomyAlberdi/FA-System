package com.example.febackendproject.Controller;

import com.example.febackendproject.DTO.BudgetDTO;
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

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<PartialBudgetDTO>> getBudgetByClientId(@PathVariable("clientId") Long clientId) {
        if (clientService.existsById(clientId)) {
            return ResponseEntity.ok(budgetService.getByClientId(clientId));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/{date}")
    public ResponseEntity<List<PartialBudgetDTO>> getBudgetByDate(@PathVariable LocalDate date) {
        return ResponseEntity.ok(budgetService.getByDate(date));
    }

    @PostMapping
    public ResponseEntity<Budget> createBudget(@RequestBody @Valid BudgetDTO budgetDTO) {
        return ResponseEntity.ok(budgetService.save(budgetDTO));
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

}
