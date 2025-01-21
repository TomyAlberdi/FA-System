package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("SELECT new com.example.febackendproject.DTO.PartialBudgetDTO(b.id, b.clientName, b.date, b.status, b.finalAmount) FROM Budget b WHERE b.clientId = ?1")
    List<PartialBudgetDTO> findByClientId(Long clientId);

    @Query("SELECT new com.example.febackendproject.DTO.PartialBudgetDTO(b.id, b.clientName, b.date, b.status, b.finalAmount) FROM Budget b WHERE DATE(b.date) = :date")
    List<PartialBudgetDTO> findByDate(LocalDate date);

}
