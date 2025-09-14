package com.example.febackendproject.DTO.Budget;

import com.example.febackendproject.Entity.Budget;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PartialBudgetDTO {

    private Long id;
    private String clientName;
    private LocalDateTime date;
    private Budget.Status status;
    private Double finalAmount;

}
