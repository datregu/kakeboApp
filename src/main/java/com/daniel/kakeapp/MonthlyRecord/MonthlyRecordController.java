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

    // Método HTTP GET para obtener el registro mensual más reciente de un usuario
    @GetMapping("/getMonthlyRecord/{userId}")
    public MonthlyRecordEntity getMonthlyRecord(@PathVariable Integer userId) {
        return monthlyRecordService.getLatestMonthlyRecord(userId);
    }

    // Método HTTP GET para obtener todos los registros mensuales de un usuario
    @GetMapping("/getAllMonthlyRecords/{userId}")
    public List<MonthlyRecordEntity> getAllMonthlyRecords(@PathVariable Integer userId) {
        return monthlyRecordService.getAllMonthlyRecordsByUserId(userId);
    }

    // Método HTTP POST para establecer el ahorro deseado de un usuario
    @PostMapping("/setDesiredSavings")
    public void setDesiredSavings(@RequestParam int userId, @RequestParam int month, @RequestParam int year, @RequestParam String desiredSavings) {
        monthlyRecordService.setDesiredSavings(userId, month, year, new BigDecimal(desiredSavings));
    }

    // Método HTTP POST para agregar un nuevo registro mensual
    @PostMapping("/addMonthlyRecord/{userId}")
    public MonthlyRecordEntity addMonthlyRecord(@PathVariable Integer userId, @RequestBody Map<String, String> body) {
        BigDecimal desiredSavings = new BigDecimal(body.get("desiredSavings"));
        return monthlyRecordService.addMonthlyRecord(userId, desiredSavings);
    }

    // Método HTTP GET para obtener el registro mensual más reciente de un usuario
    @GetMapping("/getLatestMonthlyRecord/{userId}")
    public MonthlyRecordEntity getLatestMonthlyRecord(@PathVariable Integer userId) {
        return monthlyRecordService.getLatestMonthlyRecordByUserId(userId);
    }

    // Método HTTP GET para obtener el registro mensual más reciente de un usuario, v2
    @GetMapping("/getLatestMonthlyRecordv2/{userId}")
    public MonthlyRecordEntity getLatestMonthlyRecordv2(@PathVariable Integer userId) {
    return monthlyRecordService.getLatestMonthlyRecordv2(userId);
    }

}

