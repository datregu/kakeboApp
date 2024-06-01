package com.daniel.kakeapp.Expense;
import com.daniel.kakeapp.User.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


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

    // Método para buscar el total de gastos del mes más reciente por usuario
    @Query("SELECT SUM(e.expenseAmount) FROM ExpenseEntity e WHERE e.user.userId = :userId AND MONTH(e.expenseDate) = (SELECT MONTH(MAX(e.expenseDate)) FROM ExpenseEntity e WHERE e.user.userId = :userId)")
    Optional<BigDecimal> findTotalExpensesByLastMonth(@Param("userId") Integer userId);

    // Método para buscar el total de una categoria de gastos del mes más reciente por usuario
    @Query("SELECT SUM(e.expenseAmount) FROM ExpenseEntity e WHERE e.user.userId = :userId AND e.expenseCategory = :category AND MONTH(e.expenseDate) = (SELECT MONTH(MAX(e.expenseDate)) FROM ExpenseEntity e WHERE e.user.userId = :userId)")
    Optional<BigDecimal> findTotalExpensesByCategoryAndLastMonth(@Param("userId") Integer userId, @Param("category") ExpenseCategory category);

    // Método para buscar el total de gastos fijos del mes más reciente por usuario
    @Query("SELECT SUM(e.expenseAmount) FROM ExpenseEntity e WHERE e.user.userId = :userId AND e.expenseCategory = 'FIXED' AND MONTH(e.expenseDate) = (SELECT MAX(MONTH(e.expenseDate)) FROM ExpenseEntity e WHERE e.user.userId = :userId AND e.expenseCategory = 'FIXED')")
    Optional<BigDecimal> findTotalFixedExpensesByLastMonth(@Param("userId") Integer userId);

    // Método para buscar la lista de gastos de un usuario del mes más reciente
    @Query("SELECT e FROM ExpenseEntity e WHERE e.user.userId = :userId AND MONTH(e.expenseDate) = (SELECT MONTH(MAX(e.expenseDate)) FROM ExpenseEntity e WHERE e.user.userId = :userId)")
    List<ExpenseEntity> findExpensesByUserIdAndLastMonth(@Param("userId") Integer userId);

}