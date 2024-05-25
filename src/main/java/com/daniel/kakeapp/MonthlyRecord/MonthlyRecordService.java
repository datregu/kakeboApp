package com.daniel.kakeapp.MonthlyRecord;

import com.daniel.kakeapp.Expense.ExpenseRepository;
import com.daniel.kakeapp.Income.IncomeRepository;
import com.daniel.kakeapp.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class MonthlyRecordService {
    private final MonthlyRecordRepository monthlyRecordRepo;
    private final IncomeRepository incomeRepo;
    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;

    public MonthlyRecordEntity getAndUpdateMonthlyRecord(int month, int year, Integer userId) {
        // Buscar el registro mensual para el usuario, mes y año dados
        MonthlyRecordEntity monthlyRecord = monthlyRecordRepo.findByUserAndMonthAndYear(userId, month, year);

        // Si el registro mensual no existe, crear uno nuevo
        if (monthlyRecord == null) {
            monthlyRecord = new MonthlyRecordEntity();
            monthlyRecord.setUser(userRepo.findById(userId).orElse(null));
            monthlyRecord.setMonth(month);
            monthlyRecord.setYear(year);
            monthlyRecord.setFixed_expenses(BigDecimal.ZERO);
            monthlyRecord.setDesired_savings(BigDecimal.ZERO);
        }

        // Actualizar los campos del registro mensual con los datos de las tablas Income y Expense
        monthlyRecord.setTotal_income(incomeRepo.findTotalIncomesByMonth(month));
        monthlyRecord.setTotal_expense(expenseRepo.findTotalExpensesByMonth(month));


        // Calcular el total de ahorros real_savings
        BigDecimal realSavings = monthlyRecord.getTotal_income().subtract(monthlyRecord.getTotal_expense());
        monthlyRecord.setReal_savings(realSavings);

        // Guardar el registro mensual actualizado en la base de datos
        monthlyRecordRepo.save(monthlyRecord);

        return monthlyRecord;
    }

    public void setDesiredSavings(int userId, int month, int year, BigDecimal desiredSavings) {
    // Buscar el registro mensual para el usuario, mes y año dados
    MonthlyRecordEntity monthlyRecord = monthlyRecordRepo.findByUserAndMonthAndYear(userId, month, year);

    // Si el registro mensual no existe, lanzar una excepción
    if (monthlyRecord == null) {
        throw new IllegalArgumentException("No se encontró un registro mensual para el usuario, mes y año dados");
    }

    // Establecer el valor de desired_savings
    monthlyRecord.setDesired_savings(desiredSavings);

    // Guardar el registro mensual actualizado en la base de datos
    monthlyRecordRepo.save(monthlyRecord);
}
public void setFixedExpenses (int userId, int month, int year, BigDecimal fixedExpenses) {
    // Buscar el registro mensual para el usuario, mes y año dados
    MonthlyRecordEntity monthlyRecord = monthlyRecordRepo.findByUserAndMonthAndYear(userId, month, year);

    // Si el registro mensual no existe, lanzar una excepción
    if (monthlyRecord == null) {
        throw new IllegalArgumentException("No se encontró un registro mensual para el usuario, mes y año dados");
    }

    // Establecer el valor de fixed_expenses
    monthlyRecord.setFixed_expenses(fixedExpenses);

    // Guardar el registro mensual actualizado en la base de datos
    monthlyRecordRepo.save(monthlyRecord);

}
}