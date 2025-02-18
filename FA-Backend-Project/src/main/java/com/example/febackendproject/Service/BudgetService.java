package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.BudgetReportMonthDTO;
import com.example.febackendproject.DTO.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.ProductBudget;
import com.example.febackendproject.Repository.BudgetRepository;
import com.example.febackendproject.Repository.StockRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

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
    
    public List<PartialBudgetDTO> getLastBudgets() {
        return budgetRepository.getLastBudgets();
    }
    
    public List<BudgetReportMonthDTO> getReportBudget() {
        List<Object[]> rawData = budgetRepository.getBudgetsByMonth();
        Map<String, BudgetReportMonthDTO> reportMap = new LinkedHashMap<>();
        
        Locale spanishLocale = new Locale("es", "ES");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM", spanishLocale);
        
        LocalDate now = LocalDate.now();
        for (int i = 0; i < 6; i++) {
            String month = now.minusMonths(i).format(formatter);
            reportMap.put(month, new BudgetReportMonthDTO(month, 0, 0, 0, 0, 0));
        }
        
        for (Object[] record : rawData) {
            String rawMonth = (String) record[0];
            Byte status = (Byte) record[1];
            Integer total = ((Number) record[2]).intValue();
            
            YearMonth yearMonth = YearMonth.parse(rawMonth, DateTimeFormatter.ofPattern("yyyy-MM"));
            String month = yearMonth.format(formatter);
            
            BudgetReportMonthDTO report = reportMap.get(month);
            if (report != null) {
                switch (status) {
                    case 0:
                        report.setPENDIENTE(total);
                        break;
                    case 1:
                        report.setPAGO(total);
                        break;
                    case 2:
                        report.setENVIADO(total);
                        break;
                    case 3:
                        report.setENTREGADO(total);
                        break;
                    case 4:
                        report.setCANCELADO(total);
                        break;
                }
            }
        }
        return new ArrayList<>(reportMap.values());
    }
    
}
