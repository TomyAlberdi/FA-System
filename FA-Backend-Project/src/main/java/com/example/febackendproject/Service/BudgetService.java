package com.example.febackendproject.Service;

import com.example.febackendproject.DTO.Budget.CreateBudgetDTO;
import com.example.febackendproject.DTO.BudgetReportMonthDTO;
import com.example.febackendproject.DTO.Budget.PartialBudgetDTO;
import com.example.febackendproject.DTO.CreateCashRegisterRecordDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.CashRegisterRecord;
import com.example.febackendproject.Entity.Client;
import com.example.febackendproject.Entity.ProductBudget;
import com.example.febackendproject.Exception.ResourceNotFoundException;
import com.example.febackendproject.Mapper.BudgetMapper;
import com.example.febackendproject.Mapper.CashRegisterRecordMapper;
import com.example.febackendproject.Repository.BudgetRepository;
import com.example.febackendproject.Repository.ClientRepository;
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
    private final ClientRepository clientRepository;
    private final StockService stockService;
    private final StockRepository stockRepository;
    private final CashRegisterService cashRegisterService;
    
    public Budget getById(Long id) {
        Optional<Budget> budget = budgetRepository.findById(id);
        if (budget.isEmpty()) {
            throw new ResourceNotFoundException("El presupuesto ID " + id + " no existe.");
        }
        return budget.get();
    }

    public List<PartialBudgetDTO> getByClientId(Long clientId) {
        return budgetRepository.findByClientId(clientId);
    }

    public void assertBudgetExists(Long id) {
        if (!budgetRepository.existsById(id)) {
            throw new ResourceNotFoundException("El presupuesto ID " + id + " no existe.");
        }
    }
    
    public Budget save(CreateBudgetDTO dto, Long clientId) {
        Client client;
        if (clientId != null) {
            client = clientRepository.findById(clientId)
                    .orElseGet(() -> clientService.save(dto.getClient()));
        } else {
            client = clientService.save(dto.getClient());
        }
        Budget newBudget = BudgetMapper.createBudget(dto, client);
        return budgetRepository.save(newBudget);
    }

    public List<String> updateStatus(Long id, Budget.Status status) {
        Optional<Budget> search = budgetRepository.findById(id);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("El presupuesto ID " + id + " no existe.");
        }
        Budget budget = search.get();
        if (budget.getStockDecreased() ) {
            budgetRepository.updateStatus(status, budget.getId());
            return Collections.emptyList();
        }
        List<String> unavailableProducts = new ArrayList<>();
        List<ProductBudget> budgetProducts = budget.getProducts();
        boolean paid = status.equals(Budget.Status.PAGO) || status.equals(Budget.Status.ENVIADO) || status.equals(Budget.Status.ENTREGADO);
        if (paid) {
            budgetProducts.forEach(product -> {
                Integer stockAvailable = stockRepository.getQuantityByProductId(product.getId());
                if (stockAvailable < product.getSaleUnitQuantity()) {
                    unavailableProducts.add(product.getProductName());
                }
            });
        }
        if (unavailableProducts.isEmpty()) {
            budgetProducts.forEach(product -> stockService.decreaseStockById(product.getId(), product.getSaleUnitQuantity()));
            if (paid) {
                // Create Cash Register Record on Budget Status Change (Budget ID as Record Detail)
                CreateCashRegisterRecordDTO dto = CashRegisterRecordMapper.createDTO(budget);
                cashRegisterService.addRecord(dto);
            }
            budget.setStatus(status);
            budget.setStockDecreased(true);
            budgetRepository.save(budget);
            return Collections.emptyList();
        }
        return unavailableProducts;
    }

    public List<PartialBudgetDTO> getByDate(LocalDate date) {
        return budgetRepository.findByDate(date);
    }

    public List<PartialBudgetDTO> getByDateRange(LocalDate start, LocalDate end) {
        return budgetRepository.findByDateBetween(start, end);
    }

    public Budget update(CreateBudgetDTO dto, Long clientId, Long budgetId) {
        Optional<Budget> search = budgetRepository.findById(budgetId);
        if (search.isEmpty()) {
            throw new ResourceNotFoundException("El presupuesto ID " + budgetId + " no existe.");
        }
        Budget budget = search.get();
        Client client;
        if (clientId != null) {
            client = clientRepository.findById(clientId)
                    .orElseGet(() -> clientService.save(dto.getClient()));
        } else {
            client = clientService.save(dto.getClient());
        }
        BudgetMapper.updateFromDTO(budget, dto, client);
        return budgetRepository.save(budget);
    }

    public void delete(Long id) {
        assertBudgetExists(id);
        budgetRepository.deleteById(id);
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
