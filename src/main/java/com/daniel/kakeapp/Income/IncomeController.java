package com.daniel.kakeapp.Income;


import com.daniel.kakeapp.Expense.ExpenseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api")

public class IncomeController {
    private IncomeService incomeService;

    @Autowired
    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping("/createIncome/{userId}")
    public void createIncome(@PathVariable Integer userId, @RequestBody IncomeEntity incomeEntity) {
        incomeService.createIncome(incomeEntity, userId);
    }

    @GetMapping("/incomeList")
    @ResponseBody
    public List<IncomeEntity> listIncomes() {

        return incomeService.listIncomes();
    }

@GetMapping("/totalIncomeByMonth")
    @ResponseBody
    public BigDecimal totalIncomeByMonth(@RequestParam int month) {
        return incomeService.findTotalIncomesByMonth(month);
    }
}
