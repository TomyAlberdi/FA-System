package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PartialBudgetDTO;
import com.example.febackendproject.Entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("SELECT new com.example.febackendproject.DTO.PartialBudgetDTO(b.id, b.clientName, b.date, b.status, b.finalAmount) FROM Budget b WHERE b.clientId = ?1")
    List<PartialBudgetDTO> findByClientId(Long clientId);

    @Query("SELECT new com.example.febackendproject.DTO.PartialBudgetDTO(b.id, b.clientName, b.date, b.status, b.finalAmount) FROM Budget b WHERE DATE(b.date) = :date")
    List<PartialBudgetDTO> findByDate(LocalDate date);
    
    @Query("SELECT new com.example.febackendproject.DTO.PartialBudgetDTO(b.id, b.clientName, b.date, b.status, b.finalAmount) FROM Budget b WHERE DATE(b.date) BETWEEN :startDate AND :endDate")
    List<PartialBudgetDTO> findByDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Modifying
    @Transactional
    @Query("UPDATE Budget SET status = ?1 WHERE id = ?2")
    void updateStatus(Budget.Status status, Long id);
    
    @Modifying
    @Transactional
    @Query("UPDATE Budget SET stockDecreased = true WHERE id = ?1")
    void updateStockDecreased(Long id);

}
