package com.example.febackendproject.DTO;

import com.example.febackendproject.Entity.ProductBudget;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BudgetDTO {

    private Long clientId;
    private List<ProductBudget> products;

}
