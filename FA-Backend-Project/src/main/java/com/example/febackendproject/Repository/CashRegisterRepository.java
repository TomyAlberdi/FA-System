package com.example.febackendproject.Repository;

import com.example.febackendproject.DTO.PricesDTO;
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

    @Query("""
                SELECT
                    COALESCE(SUM(CASE WHEN c.type = com.example.febackendproject.Entity.CashRegisterRecord.Type.INGRESO THEN c.amount ELSE 0 END), 0)
                    -
                    COALESCE(SUM(CASE WHEN c.type = com.example.febackendproject.Entity.CashRegisterRecord.Type.GASTO THEN c.amount ELSE 0 END), 0)
                FROM CashRegisterRecord c
            """)
    Double getTotalAmount();

    @Query("""
                SELECT
                    COALESCE(SUM(CASE WHEN c.type = com.example.febackendproject.Entity.CashRegisterRecord.Type.INGRESO THEN c.amount ELSE 0 END), 0),
                    COALESCE(SUM(CASE WHEN c.type = com.example.febackendproject.Entity.CashRegisterRecord.Type.GASTO THEN c.amount ELSE 0 END), 0)
                FROM CashRegisterRecord c
                WHERE c.date BETWEEN :#{#yearMonth.atDay(1)} AND :#{#yearMonth.atEndOfMonth()}
            """)
    Object getTypes(@Param("yearMonth") YearMonth yearMonth);


}
