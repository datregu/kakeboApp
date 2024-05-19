package com.daniel.kakeapp.Expense;
import com.daniel.kakeapp.User.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
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
    BigDecimal findTotalExpensesByMonth(@Param("month") int month);

    // Método para buscar gastos por usuario
    @Query("SELECT e FROM ExpenseEntity e WHERE e.user = :user ORDER BY e.expenseDate DESC")
    List<ExpenseEntity> findByUser(UserEntity user);
}