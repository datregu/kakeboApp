package com.daniel.kakeapp.Income;

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

    @PutMapping("/updateIncome/{incomeId}")
    public void updateIncome(@PathVariable Integer incomeId, @RequestBody IncomeEntity incomeEntity) {
        incomeService.updateIncome(incomeId, incomeEntity);
    }

    @DeleteMapping("/deleteIncome/{incomeId}")
    public void deleteIncome(@PathVariable Integer incomeId) {
        incomeService.deleteIncome(incomeId);
    }

    @GetMapping("/incomeListByMonth/{userId}")
    @ResponseBody
    public List<IncomeEntity> incomeListByMonth(@PathVariable Integer userId) {
        return incomeService.findIncomesByMonth(userId);
    }

    @GetMapping("/totalIncomeByMonth")
    @ResponseBody
    public BigDecimal totalIncomeByMonth(@RequestParam int month) {
        return incomeService.findTotalIncomesByMonth(month);
    }

    @GetMapping("/totalIncomeByLastMonth/{userId}")
    @ResponseBody
    public BigDecimal totalIncomeByLastMonth(@PathVariable Integer userId) {
        return incomeService.findTotalIncomesByLastMonth(userId);
    }

    @GetMapping("/incomeListLastMonth/{userId}")
@ResponseBody
public List<IncomeEntity> listIncomesLastMonth(@PathVariable Integer userId) {
    return incomeService.listIncomesLastMonth(userId);
}

}