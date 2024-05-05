package com.daniel.kakeapp.Expense;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {
    private ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/createExpense")
    public void createExpense(@RequestBody ExpenseEntity expenseEntity) {
        expenseService.createExpense(expenseEntity);
    }

    @PutMapping("/update/{expenseId}")
    public void updateExpense(@PathVariable Integer expenseId, @RequestBody ExpenseEntity expenseEntity) {
        expenseService.updateExpense(expenseId, expenseEntity);
    }

    @GetMapping("/list")
    @ResponseBody
    public List<ExpenseEntity> listExpenses() {

        return expenseService.listExpenses();
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
    @GetMapping("/totalByMonth")
    @ResponseBody
    public Double totalExpensesByMonth(@RequestParam int month) {
        return expenseService.findTotalExpensesByMonth(month);
    }
}
