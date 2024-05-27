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

    @PostMapping("/createExpense/{userId}")
    public void createExpense(@PathVariable Integer userId, @RequestBody ExpenseEntity expenseEntity) {
        expenseService.createExpense(expenseEntity, userId);
    }

    @PutMapping("/updateExpense/{expenseId}")
    public void updateExpense(@PathVariable Integer expenseId, @RequestBody ExpenseEntity expenseEntity) {
        expenseService.updateExpense(expenseId, expenseEntity);
    }

    @GetMapping("/expenseList/{userId}")
    @ResponseBody
    public List<ExpenseEntity> listExpenses(@PathVariable Integer userId) {
        return expenseService.listExpensesExcludeFixed(userId);
    }

    /* Método para eliminar un gasto en la base de datos por su expenseId */
    @DeleteMapping("/delete/{expenseId}")
    public void deleteExpense(@PathVariable Integer expenseId) {

        expenseService.deleteExpense(expenseId);
    }


    /* Método para buscar por categoria
     * Para llamar a este método, se debe hacer una petición GET a /expense/listByCategory?category=CATEGORY
     *  */
    @GetMapping("/listByCategory")
    @ResponseBody
    public List<ExpenseEntity> listExpensesByCategory(@RequestParam ExpenseCategory category) {
        return expenseService.findExpensesByCategory(category);
    }

    // Método para buscar por mes
    // Para llamar a este método, se debe hacer una petición GET a /expense/listByMonth?month=MONTH
    @GetMapping("/listByMonth")
    @ResponseBody
    public List<ExpenseEntity> listExpensesByMonth(@RequestParam int month) {
        return expenseService.findExpensesByMonth(month);
    }

    // Método para devolver el total de gastos de un mes
    // Para llamar a este método, se debe hacer una petición GET a /expense/totalByMonth?month=MONTH
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

    @GetMapping("/totalExpenseByLastMonth/{userId}")
    @ResponseBody
    public BigDecimal findTotalExpensesByUserIdAndMonth(@PathVariable Integer userId) {
        return expenseService.findTotalExpensesByLastMonth(userId);
    }



}



