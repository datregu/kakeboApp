package com.daniel.kakeapp.Expense;

import com.daniel.kakeapp.User.UserRepository;
import com.daniel.kakeapp.User.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    /* Método para buscar por expenseCategory
     * Como este método no viene incluido de serie en expenseRepo, se debe crear un método en el repositorio
     *  */
    public List<ExpenseEntity> findExpensesByCategory(ExpenseCategory category) {
        return expenseRepo.findByExpenseCategory(category);
    }


    // Método para buscar por mes, se le pasa el mes como parámetro
    public List<ExpenseEntity> findExpensesByMonth(int month) {
        return expenseRepo.findByExpenseMonth(month);
    }

    // Método para buscar el total de gastos de un mes
    public Double findTotalExpensesByMonth(int month) {
        return expenseRepo.findTotalExpensesByMonth(month);
    }
}
