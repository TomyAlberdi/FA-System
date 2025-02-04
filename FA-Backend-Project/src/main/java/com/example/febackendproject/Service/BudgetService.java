package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.ProductBudget;
import com.example.febackendproject.Repository.BudgetRepository;
import com.example.febackendproject.Repository.StockRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class BudgetService {
    
    private final BudgetRepository budgetRepository;
    private final ClientService clientService;
    private final StockService stockService;
    private final StockRepository stockRepository;
    
    public Boolean existsById(Long id) {
        return budgetRepository.existsById(id);
    }
    
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
    
    public List<PartialBudgetDTO> getByDateRange(LocalDate start, LocalDate end) {
        return budgetRepository.findByDateBetween(start, end);
    }
    
    public Optional<List<String>> updateStatus(Budget.Status status, Long id) {
        List<String> unavailableProducts = new ArrayList<>();
        Optional<Budget> budget = budgetRepository.findById(id);
        List<ProductBudget> budgetProducts = new ArrayList<>();
        if (budget.isPresent()) {
            budgetProducts = budget.get().getProducts();
        }
        if (budget.isPresent() && !budget.get().getStockDecreased() && (status.equals(Budget.Status.PAGO) || status.equals(Budget.Status.ENVIADO) || status.equals(Budget.Status.ENTREGADO))) {
            budgetProducts.forEach(product -> {
                Integer stockAvailable = stockRepository.getQuantityByProductId(product.getId());
                if (stockAvailable < product.getSaleUnitQuantity()) {
                    unavailableProducts.add(product.getProductName());
                }
            });
        }
        if (unavailableProducts.isEmpty()) {
            budgetProducts.forEach(product -> {
                stockService.decreaseStockById(product.getId(), product.getSaleUnitQuantity());
            });
            budgetRepository.updateStatus(status, id);
            budgetRepository.updateStockDecreased(id);
            return Optional.empty();
        }
        return Optional.of(unavailableProducts);
    }
    
}
