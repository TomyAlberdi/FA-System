package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.CashRegisterRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface CashRegisterRepository extends JpaRepository<CashRegisterRecord, Long> {

    @Query("SELECT c FROM CashRegisterRecord c WHERE c.date = :date")
    List<CashRegisterRecord> getByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(c.amount) FROM CashRegisterRecord c")
    Double getTotalAmount();

}
