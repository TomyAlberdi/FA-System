package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    @Query("SELECT b FROM Budget b WHERE b.clientId = ?1")
    List<Budget> findByClientId(Long clientId);

    @Query("SELECT b FROM Budget b WHERE DATE(b.date) = :date")
    List<Budget> findByDate(LocalDate date);

}
