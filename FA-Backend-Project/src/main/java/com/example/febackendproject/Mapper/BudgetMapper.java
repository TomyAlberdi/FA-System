package com.example.febackendproject.Mapper;

import com.example.febackendproject.DTO.Budget.CreateBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import com.example.febackendproject.Entity.Client;

import java.time.LocalDateTime;

public class BudgetMapper {

    public static Budget createBudget(CreateBudgetDTO dto, Client client) {
        Budget budget = new Budget();
        updateFromDTO(budget, dto, client);
        return budget;
    }

    public static void updateFromDTO(Budget budget, CreateBudgetDTO dto, Client client) {
        budget.setDate(LocalDateTime.now());
        if (client != null) {
            budget.setClientId(client.getId());
            budget.setClientName(client.getName());
        } else {
            budget.setClientId(null);
            budget.setClientName(null);
        }
        budget.setStatus(Budget.Status.PENDIENTE);
        budget.setDiscount(dto.getDiscount());
        budget.setProducts(dto.getProducts());
        budget.setFinalAmount(dto.getTotal());
    }

}
