package com.daniel.kakeapp.MonthlyRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MonthlyRecordRepository extends JpaRepository<MonthlyRecordEntity, Integer>{
    // Método para buscar un registro mensual por usuario, mes y año
    @Query("SELECT m FROM MonthlyRecordEntity m WHERE m.user.userId = :userId AND m.month = :month AND m.year = :year")
    MonthlyRecordEntity findByUserAndMonthAndYear(Integer userId, int month, int year);
    // Método para buscar todos los registros mensuales de un usuario
    @Query("SELECT m FROM MonthlyRecordEntity m WHERE m.user.userId = :userId")
    List<MonthlyRecordEntity> findAllByUserId(Integer userId);

    // Método para buscar el último registro mensual de un usuario
    @Query("SELECT m FROM MonthlyRecordEntity m WHERE m.user.userId = :userId ORDER BY m.year DESC, m.month DESC")
List<MonthlyRecordEntity> findLatestMonthlyRecordByUserId(@Param("userId") Integer userId);
}
