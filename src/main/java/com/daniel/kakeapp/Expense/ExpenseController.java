package com.daniel.kakeapp.Expense;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {
    private ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    //Crear un gasto para un usuario
    @PostMapping("/createExpense/{userId}")
    public void createExpense(@PathVariable Integer userId, @RequestBody ExpenseEntity expenseEntity) {
        expenseService.createExpense(expenseEntity, userId);
    }

    //Actualizar un gasto por su id
    @PutMapping("/updateExpense/{expenseId}")
    public void updateExpense(@PathVariable Integer expenseId, @RequestBody ExpenseEntity expenseEntity) {
        expenseService.updateExpense(expenseId, expenseEntity);
    }

    //Devuelve una lista de gastos de un usuario
    @GetMapping("/expenseList/{userId}")
    @ResponseBody
    public List<ExpenseEntity> listExpenses(@PathVariable Integer userId) {
        return expenseService.listExpensesExcludeFixed(userId);
    }

    //Borrar un gasto por su id
    @DeleteMapping("/delete/{expenseId}")
    public void deleteExpense(@PathVariable Integer expenseId) {

        expenseService.deleteExpense(expenseId);
    }

    // Devuelve una lista de gastos de una categoría específica
    @GetMapping("/listByCategory")
    @ResponseBody
    public List<ExpenseEntity> listExpensesByCategory(@RequestParam ExpenseCategory category) {
        return expenseService.findExpensesByCategory(category);
    }

    // Método para buscar por mes, devuelve una lista de gastos de un mes específico de TODOS los usuarios
    @GetMapping("/listByMonth")
    @ResponseBody
    public List<ExpenseEntity> listExpensesByMonth(@RequestParam int month) {
        return expenseService.findExpensesByMonth(month);
    }

    // Método para devolver el total de gastos de un mes
    @GetMapping("/totalExpenseByMonth")
    @ResponseBody
    public BigDecimal totalExpensesByMonth(@RequestParam int month) {
        return expenseService.findTotalExpensesByMonth(month);
    }

    // Método para devolver el total de gastos FIJOS del ultimo mes
    @GetMapping("/expenseListFixedLastMonth/{userId}")
    @ResponseBody
    public List<ExpenseEntity> listExpensesOnlyFixedLastMonth(@PathVariable Integer userId) {
        return expenseService.listExpensesOnlyFixedLastMonth(userId);
    }
    // Devuelve el total de gastos del ultimo mes por usuario
    @GetMapping("/totalExpenseByLastMonth/{userId}")
    @ResponseBody
    public BigDecimal findTotalExpensesByUserIdAndMonth(@PathVariable Integer userId) {
        return expenseService.findTotalExpensesByLastMonth(userId);
    }
    // Devuelve el total de gastos FIJOS del ultimo mes por usuario
    @GetMapping("/totalFixedExpensesByLastMonth/{userId}")
    @ResponseBody
    public BigDecimal totalFixedExpensesByLastMonth(@PathVariable Integer userId) {
        return expenseService.findTotalFixedExpensesByLastMonth(userId);
    }

@GetMapping("/lastMonthExpenseList/{userId}")
@ResponseBody
public List<ExpenseEntity> listExpensesExcludeFixedLastMonth(@PathVariable Integer userId) {
    return expenseService.listExpensesExcludeFixedLastMonth(userId);
}

}



