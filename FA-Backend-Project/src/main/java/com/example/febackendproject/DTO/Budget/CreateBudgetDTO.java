package com.example.febackendproject.DTO.Budget;

import com.example.febackendproject.DTO.Client.CreateClientDTO;
import com.example.febackendproject.Entity.ProductBudget;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateBudgetDTO {
    private CreateClientDTO client;
    private List<ProductBudget> products;
    private Integer discount;
    private Double total;
}
