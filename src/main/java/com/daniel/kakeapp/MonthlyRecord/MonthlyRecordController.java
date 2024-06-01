package com.daniel.kakeapp.MonthlyRecord;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MonthlyRecordController {
    private final MonthlyRecordService monthlyRecordService;

    @GetMapping("/getMonthlyRecord/{userId}")
    public MonthlyRecordEntity getMonthlyRecord(@PathVariable Integer userId) {
        return monthlyRecordService.getLatestMonthlyRecord(userId);
    }

    @GetMapping("/getAllMonthlyRecords/{userId}")
    public List<MonthlyRecordEntity> getAllMonthlyRecords(@PathVariable Integer userId) {
        return monthlyRecordService.getAllMonthlyRecordsByUserId(userId);
    }

    @PostMapping("/setDesiredSavings")
    public void setDesiredSavings(@RequestParam int userId, @RequestParam int month, @RequestParam int year, @RequestParam String desiredSavings) {
        monthlyRecordService.setDesiredSavings(userId, month, year, new BigDecimal(desiredSavings));
    }

    @PostMapping("/addMonthlyRecord/{userId}")
    public MonthlyRecordEntity addMonthlyRecord(@PathVariable Integer userId, @RequestBody Map<String, String> body) {
        BigDecimal desiredSavings = new BigDecimal(body.get("desiredSavings"));
        return monthlyRecordService.addMonthlyRecord(userId, desiredSavings);
    }
@GetMapping("/getLatestMonthlyRecord/{userId}")
public MonthlyRecordEntity getLatestMonthlyRecord(@PathVariable Integer userId) {
    return monthlyRecordService.getLatestMonthlyRecordByUserId(userId);
}


}

