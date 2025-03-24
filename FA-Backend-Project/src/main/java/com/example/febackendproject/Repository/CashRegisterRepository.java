package com.example.febackendproject.Repository;

import com.example.febackendproject.Entity.CashRegister;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface CashRegisterRepository extends JpaRepository<CashRegister, Long> {

    @Query("SELECT c FROM CashRegister c WHERE YEAR(c.date) = :#{#month.year} AND MONTH(c.date) = :#{#month.monthValue}")
    List<CashRegister> getByMonth(@Param("month") YearMonth month);

    @Query("SELECT c FROM CashRegister c WHERE c.date = :date")
    Optional<CashRegister> getByDate(@Param("date") LocalDate date);

}
