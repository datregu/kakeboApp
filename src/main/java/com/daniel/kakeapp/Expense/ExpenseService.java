package com.daniel.kakeapp.Expense;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepo;

    public void createExpense(ExpenseEntity expenseEntity) {
    expenseRepo.save(expenseEntity);
}
/* Método para actualizar un gasto en la base de datos por su ID */
public void updateExpense(Integer expenseId, ExpenseEntity expenseEntity) {
    if (expenseRepo.existsById(expenseId)) {
        expenseEntity.setExpenseId(expenseId);
        expenseRepo.save(expenseEntity);
    } else {
        throw new IllegalArgumentException("No se encuentra el gasto con el ID proporcionado");
    }
}

/* Método para listar todos los gastos en la base de datos */
public List<ExpenseEntity> listExpenses() {
    return expenseRepo.findAll();
}

/* Método para eliminar un gasto en la base de datos por su ID */
public void deleteExpense(Integer expenseId) {
    if (expenseRepo.existsById(expenseId)) {
        expenseRepo.deleteById(expenseId);
    } else {
        throw new IllegalArgumentException("No se encuentra el gasto con el ID proporcionado");
    }
}

    /* Método para buscar por categoria
    * Como este método no viene incluuido de serie en expenseRepo, se debe crear un método en el repositorio
    *  */
public List<ExpenseEntity> findExpensesByCategory(ExpenseCategory category) {
    // Assuming you have an ExpenseRepository with a method findByExpenseCategory
    return expenseRepo.findByExpenseCategory(category);
}


// Método para buscar por mes
public List<ExpenseEntity> findExpensesByMonth(int month) {
    return expenseRepo.findByExpenseMonth(month);
}
}
