package com.daniel.kakeapp.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ExpenseRepository extends JpaRepository<ExpenseEntity, Integer> {
    // Método para buscar por categoria
    List<ExpenseEntity> findByExpenseCategory(ExpenseCategory category);

    // Método para buscar por mes
    @Query("SELECT e FROM ExpenseEntity e WHERE MONTH(e.expenseDate) = :month")
List<ExpenseEntity> findByExpenseMonth(@Param("month") int month);

    // Método para que devuelva el total de gastos de un mes
    @Query("SELECT SUM(e.expenseAmount) FROM ExpenseEntity e WHERE MONTH(e.expenseDate) = :month")
    Double findTotalExpensesByMonth(@Param("month") int month);

}
