package com.daniel.kakeapp.MonthlyRecord;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MonthlyRecordController {
    private final MonthlyRecordService monthlyRecordService;

    @GetMapping("/monthlyRecord")
    public MonthlyRecordEntity getMonthlyRecord(@RequestParam int month, @RequestParam int year, @RequestParam Integer userId) {
        return monthlyRecordService.getAndUpdateMonthlyRecord(month, year, userId);
    }

    @PostMapping("/setDesiredSavings")
    public void setDesiredSavings(@RequestParam int userId, @RequestParam int month, @RequestParam int year, @RequestParam String desiredSavings) {
        monthlyRecordService.setDesiredSavings(userId, month, year, new BigDecimal(desiredSavings));
    }
    @PostMapping("/setFixedExpenses")
    public void setFixedExpenses(@RequestParam int userId, @RequestParam int month, @RequestParam int year, @RequestParam String fixedExpenses) {
        monthlyRecordService.setFixedExpenses(userId, month, year, new BigDecimal(fixedExpenses));
    }
}

