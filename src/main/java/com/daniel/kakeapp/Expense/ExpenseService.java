package com.daniel.kakeapp.Expense;

import com.daniel.kakeapp.User.UserRepository;
import com.daniel.kakeapp.User.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;

    /* Método para crear un gasto en la base de datos */
    public void createExpense(ExpenseEntity expenseEntity, Integer userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No se encuentra el usuario con el ID proporcionado"));
        expenseEntity.setUser(user);
        expenseRepo.save(expenseEntity);
    }

    /* Método para actualizar un gasto en la base de datos por su ID */
    public void updateExpense(Integer expenseId, ExpenseEntity expenseEntity) {
        if (expenseRepo.existsById(expenseId)) {
            ExpenseEntity existingExpense = expenseRepo.findById(expenseId)
                    .orElseThrow(() -> new IllegalArgumentException("No se encuentra el gasto con el ID proporcionado"));

            existingExpense.setExpenseAmount(expenseEntity.getExpenseAmount());
            existingExpense.setExpenseDate(expenseEntity.getExpenseDate());
            existingExpense.setExpenseDescription(expenseEntity.getExpenseDescription());
            existingExpense.setExpenseCategory(expenseEntity.getExpenseCategory());

            expenseRepo.save(existingExpense);
        } else {
            throw new IllegalArgumentException("No se encuentra el gasto con el ID proporcionado");
        }
    }

    /* Método para listar todos los gastos en la base de datos */
    public List<ExpenseEntity> listExpenses(Integer userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No se encuentra el usuario con el ID proporcionado"));
        return expenseRepo.findByUser(user);
    }
/* Método para listar todos los gastos en la base de datos EXCEPTO LOS FIXED */
public List<ExpenseEntity> listExpensesExcludeFixed(Integer userId) {
    UserEntity user = userRepo.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("No se encuentra el usuario con el ID proporcionado"));
    List<ExpenseEntity> expenses = expenseRepo.findByUser(user);
    expenses.removeIf(expense -> expense.getExpenseCategory() == ExpenseCategory.FIXED);
    return expenses;
}

    /* Método para eliminar un gasto en la base de datos por su ID */
    public void deleteExpense(Integer expenseId) {
        if (expenseRepo.existsById(expenseId)) {
            expenseRepo.deleteById(expenseId);
        } else {
            throw new IllegalArgumentException("No se encuentra el gasto con el ID proporcionado");
        }
    }

    public List<ExpenseEntity> listExpensesOnlyFixedLastMonth(Integer userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("No se encuentra el usuario con el ID proporcionado"));
        List<ExpenseEntity> expenses = expenseRepo.findByUser(user);
        expenses.removeIf(expense -> expense.getExpenseCategory() != ExpenseCategory.FIXED);
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        expenses.removeIf(expense -> expense.getExpenseDate().isBefore(oneMonthAgo));
        return expenses;
    }

    /* Método para buscar por expenseCategory
     * Como este método no viene incluido de serie en expenseRepo, se debe crear un método en el repositorio
     *  */
    public List<ExpenseEntity> findExpensesByCategory(ExpenseCategory category) {
        List<ExpenseEntity> resultByCategory = expenseRepo.findByExpenseCategory(category);
        if (resultByCategory.isEmpty()) {
            throw new IllegalArgumentException("No se encuentran gastos para la categoría proporcionada");
        } else {
            return resultByCategory;
        }
    }


    // Método para buscar por mes, se le pasa el mes como parámetro
    public List<ExpenseEntity> findExpensesByMonth(int month) {
        List<ExpenseEntity> resultByMonth = expenseRepo.findByExpenseMonth(month);
        if (resultByMonth.isEmpty()) {
            throw new IllegalArgumentException("No se encuentran gastos para el mes proporcionado");
        } else {
            return resultByMonth;
        }
    }

    // Método para buscar el total de gastos de un mes
    public BigDecimal findTotalExpensesByMonth(int month) {
        BigDecimal resultTotalExpenses = expenseRepo.findTotalExpensesByMonth(month);
        if (resultTotalExpenses == null) {
            throw new IllegalArgumentException("No se encuentran gastos para el mes proporcionado");
        } else {
            return resultTotalExpenses;
        }
    }

    public BigDecimal findTotalExpensesByLastMonth(Integer userId) {
        return expenseRepo.findTotalExpensesByLastMonth(userId).orElse(BigDecimal.ZERO);
    }


    public BigDecimal findTotalExpensesByCategoryAndLastMonth(Integer userId, ExpenseCategory category) {
        return expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, category).orElse(BigDecimal.ZERO);
    }

    public BigDecimal findTotalFixedExpensesByLastMonth(Integer userId) {
        return expenseRepo.findTotalFixedExpensesByLastMonth(userId).orElse(BigDecimal.ZERO);
    }


    public List<ExpenseEntity> listExpensesExcludeFixedLastMonth(Integer userId) {
    List<ExpenseEntity> expenses = expenseRepo.findExpensesByUserIdAndLastMonth(userId);
    expenses.removeIf(expense -> expense.getExpenseCategory() == ExpenseCategory.FIXED);
    return expenses;
}

public List<ExpenseEntity> listFixedExpensesLastMonth(Integer userId) {
    return expenseRepo.findFixedExpensesByUserIdAndLastMonth(userId);
}

}
