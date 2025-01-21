package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.BudgetDTO;
import com.example.febackendproject.DTO.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.ProductBudget;
import com.example.febackendproject.Repository.BudgetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public Optional<Budget> getById(Long id) {
        return budgetRepository.findById(id);
    }

    public List<PartialBudgetDTO> getByClientId(Long clientId) {
        return budgetRepository.findByClientId(clientId);
    }

    public Budget save(BudgetDTO budgetDTO) {
        Budget budget = new Budget();
        budget.setClientId(budgetDTO.getClientId());
        budget.setDate(LocalDateTime.now());
        budget.setClientName(budgetDTO.getClientName());
        budget.setStatus(Budget.Status.PENDIENTE);
        budget.setProducts(budgetDTO.getProducts());
        Double finalAmount = budgetDTO.getProducts().stream()
                .mapToDouble(ProductBudget::getSubtotal)
                .sum();
        budget.setFinalAmount(finalAmount);
        return budgetRepository.save(budget);
    }

    public Budget update(Budget budget) {
        return budgetRepository.save(budget);
    }

    public void delete(Long id) {
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
        }
    }

    public List<PartialBudgetDTO> getByDate(LocalDate date) {
        return budgetRepository.findByDate(date);
    }

}
