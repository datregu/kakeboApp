package com.daniel.kakeapp.MonthlyRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MonthlyRecordRepository extends JpaRepository<MonthlyRecordEntity, Integer>{
    // Método para buscar un registro mensual por usuario, mes y año
    @Query("SELECT m FROM MonthlyRecordEntity m WHERE m.user.userId = :userId AND m.month = :month AND m.year = :year")
    MonthlyRecordEntity findByUserAndMonthAndYear(Integer userId, int month, int year);
}
