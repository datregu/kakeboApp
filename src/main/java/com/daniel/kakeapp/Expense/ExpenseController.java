package com.daniel.kakeapp.Expense;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense")
@RequiredArgsConstructor
public class ExpenseController {
    private ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/create")
    public  void createExpense(@RequestBody ExpenseEntity expenseEntity) {
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
}
