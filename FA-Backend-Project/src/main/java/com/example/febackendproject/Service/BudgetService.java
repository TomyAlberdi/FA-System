package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.ProductBudget;
import com.example.febackendproject.Repository.BudgetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BudgetService {
    
    private final BudgetRepository budgetRepository;
    private final ClientService clientService;
    
    public Optional<Budget> getById(Long id) {
        return budgetRepository.findById(id);
    }
    
    public List<PartialBudgetDTO> getByClientId(Long clientId) {
        return budgetRepository.findByClientId(clientId);
    }
    
    public Budget save(Budget budget) {
        List<ProductBudget> products = budget.getProducts();
        budget.setProducts(null);
        
        Budget savedBudget = budgetRepository.save(budget);
        
        savedBudget.setProducts(products);
        return budgetRepository.save(savedBudget);
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
