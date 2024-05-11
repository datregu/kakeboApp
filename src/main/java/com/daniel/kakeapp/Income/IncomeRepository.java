package com.daniel.kakeapp.Income;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<IncomeEntity, Integer>{
    //Método para buscar ingresos en un mes concreto
    @Query("SELECT i FROM IncomeEntity i WHERE MONTH(i.incomeDate) = :month")
    List<IncomeEntity> findByIncomeMonth(@Param("month") int month);

    //Método para que devuelva el total de ingresos de un mes
    @Query ("SELECT SUM(i.incomeAmount) FROM IncomeEntity i WHERE MONTH(i.incomeDate) = :month")
    Double findTotalIncomesByMonth(@Param("month") int month);
}
