package com.daniel.kakeapp.Income;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncomeRepository extends JpaRepository<IncomeEntity, Integer>{
    //Método para buscar los ingresos del mes más reciente de un usuario
    @Query("SELECT i FROM IncomeEntity i WHERE i.user.userId = :userId AND MONTH(i.incomeDate) = (SELECT MAX(MONTH(incomeDate)) FROM IncomeEntity i2 WHERE i2.user.userId = :userId)")
    List<IncomeEntity> findIncomesByLatestMonth(@Param("userId") Integer userId);

    //Método para que devuelva el total de ingresos de un mes
    @Query ("SELECT SUM(i.incomeAmount) FROM IncomeEntity i WHERE MONTH(i.incomeDate) = :month")
    BigDecimal findTotalIncomesByMonth(@Param("month") int month);

    // Método para buscar el total de ingresos del mes más reciente por usuario
    @Query ("SELECT SUM(i.incomeAmount) FROM IncomeEntity i WHERE i.user.userId = :userId AND MONTH(i.incomeDate) = (SELECT MONTH(MAX(i.incomeDate)) FROM IncomeEntity i WHERE i.user.userId = :userId)")
    Optional<BigDecimal> findTotalIncomesByLastMonth(@Param("userId") Integer userId);

    // Método para buscar la lista de ingresos del mes más reciente por usuario
    @Query("SELECT i FROM IncomeEntity i WHERE i.user.userId = :userId AND MONTH(i.incomeDate) = (SELECT MONTH(MAX(i.incomeDate)) FROM IncomeEntity i WHERE i.user.userId = :userId)")
List<IncomeEntity> findIncomesByUserIdAndLastMonth(@Param("userId") Integer userId);
}
