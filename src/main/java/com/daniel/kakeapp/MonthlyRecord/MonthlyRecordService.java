package com.daniel.kakeapp.MonthlyRecord;

import com.daniel.kakeapp.Expense.ExpenseCategory;
import com.daniel.kakeapp.Expense.ExpenseRepository;
import com.daniel.kakeapp.Income.IncomeRepository;
import com.daniel.kakeapp.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class MonthlyRecordService {
    private final MonthlyRecordRepository monthlyRecordRepo;
    private final IncomeRepository incomeRepo;
    private final ExpenseRepository expenseRepo;
    private final UserRepository userRepo;

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

    public MonthlyRecordEntity addMonthlyRecord(Integer userId, BigDecimal desiredSavings) {
        // Obtener el total de ingresos para el mes actual
        BigDecimal totalIncome = incomeRepo.findTotalIncomesByLastMonth(userId).orElse(BigDecimal.ZERO);

        // Si no hay ingresos, lanzar una excepción
        if (totalIncome.compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalArgumentException("No hay ingresos para el mes actual");
        }

        // Crear un nuevo registro mensual
        MonthlyRecordEntity monthlyRecord = new MonthlyRecordEntity();
        monthlyRecord.setUser(userRepo.findById(userId).orElse(null));
        monthlyRecord.setMonth(LocalDate.now().getMonthValue());
        monthlyRecord.setYear(LocalDate.now().getYear());
        monthlyRecord.setDesired_savings(desiredSavings);
        monthlyRecord.setTotal_income(totalIncome);

        // Guardar el registro mensual en la base de datos
        monthlyRecordRepo.save(monthlyRecord);

        return monthlyRecord;
    }

    public MonthlyRecordEntity getLatestMonthlyRecord(Integer userId) {
        // Obtener el mes y el año actuales
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        // Buscar el registro mensual más reciente para el usuario dado
        MonthlyRecordEntity monthlyRecord = monthlyRecordRepo.findByUserAndMonthAndYear(userId, currentMonth, currentYear);

        // Si el registro mensual no existe, lanzar una excepción
        if (monthlyRecord == null) {
            throw new IllegalArgumentException("No se encontró un registro mensual para el usuario y el mes actual");
        }
        // Actualizar fixed_expenses
        monthlyRecord.setFixed_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.FIXED).orElse(BigDecimal.ZERO));

        // Actualizar los campos del registro mensual con los datos de las tablas Income y Expense
        monthlyRecord.setTotal_income(incomeRepo.findTotalIncomesByLastMonth(userId).orElse(BigDecimal.ZERO));


        //Guardar los gastos por categoria
        BigDecimal totalCultureExpenses = expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.CULTURA).orElse(BigDecimal.ZERO);
        BigDecimal totalSurvivalExpenses = expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.SUPERVIVENCIA).orElse(BigDecimal.ZERO);
        BigDecimal totalLeisureExpenses = expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.OCIO_Y_VICIO).orElse(BigDecimal.ZERO);
        BigDecimal totalExtrasExpenses = expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.EXTRAS).orElse(BigDecimal.ZERO);

        //Actualizar los campos de los gastos por categoria
        monthlyRecord.setTotal_culture_expenses(totalCultureExpenses);
        monthlyRecord.setTotal_survival_expenses(totalSurvivalExpenses);
        monthlyRecord.setTotal_leisure_expenses(totalLeisureExpenses);
        monthlyRecord.setTotal_extras_expenses(totalExtrasExpenses);

        // Calcular el total de ahorros real_savings
        BigDecimal total_expenses = totalCultureExpenses.add(totalSurvivalExpenses).add(totalLeisureExpenses).add(totalExtrasExpenses);
        monthlyRecord.setTotal_expense(total_expenses);

        BigDecimal realSavings = monthlyRecord.getTotal_income().subtract(total_expenses);
        monthlyRecord.setReal_savings(realSavings);

        // Guardar el registro mensual actualizado en la base de datos
        monthlyRecordRepo.save(monthlyRecord);

        return monthlyRecord;
    }

    public List<MonthlyRecordEntity> getAllMonthlyRecordsByUserId(Integer userId) {
        return monthlyRecordRepo.findAllByUserId(userId);
    }
    /*public MonthlyRecordEntity getAndUpdateMonthlyRecord(int month, int year, Integer userId) {
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
            monthlyRecord.setReal_savings(BigDecimal.ZERO);
        }

        // Actualizar los campos del registro mensual con los datos de las tablas Income y Expense
        monthlyRecord.setTotal_income(incomeRepo.findTotalIncomesByLastMonth(userId).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_expense(expenseRepo.findTotalExpensesByLastMonth(userId).orElse(BigDecimal.ZERO));

        //Actualizar los campos de los gastos por categoria
        monthlyRecord.setTotal_culture_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.CULTURA).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_survival_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.SUPERVIVENCIA).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_leisure_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.OCIO_Y_VICIO).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_extras_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.EXTRAS).orElse(BigDecimal.ZERO));

        // Calcular el total de ahorros real_savings
        BigDecimal realSavings = monthlyRecord.getTotal_income().subtract(monthlyRecord.getTotal_expense());
        monthlyRecord.setReal_savings(realSavings);

        // Guardar el registro mensual actualizado en la base de datos
        monthlyRecordRepo.save(monthlyRecord);

        return monthlyRecord;
    }*/

/* YA NO SE USA
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

}*/

    public MonthlyRecordEntity getLatestMonthlyRecordByUserId(Integer userId) {
        List<MonthlyRecordEntity> records = monthlyRecordRepo.findLatestMonthlyRecordByUserId(userId);
        if (records.isEmpty()) {
            throw new IllegalArgumentException("No se encontró un registro mensual para el usuario dado");
        }
        return records.get(0);
    }

    public MonthlyRecordEntity getLatestMonthlyRecordv2(Integer userId) {
        // Obtener el mes y el año actuales
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();

        // Buscar el registro mensual más reciente para el usuario dado
        MonthlyRecordEntity monthlyRecord = monthlyRecordRepo.findByUserAndMonthAndYear(userId, currentMonth, currentYear);

        // Si el registro mensual no existe para el mes actual, crear uno nuevo
        if (monthlyRecord == null) {
            monthlyRecord = new MonthlyRecordEntity();
            monthlyRecord.setUser(userRepo.findById(userId).orElse(null));
            monthlyRecord.setMonth(currentMonth);
            monthlyRecord.setYear(currentYear);
            monthlyRecord.setFixed_expenses(BigDecimal.ZERO);
            monthlyRecord.setDesired_savings(BigDecimal.ZERO);
            monthlyRecord.setReal_savings(BigDecimal.ZERO);
        }

        // Actualizar los campos del registro mensual con los datos de las tablas Income y Expense
        monthlyRecord.setTotal_income(incomeRepo.findTotalIncomesByLastMonth(userId).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_expense(expenseRepo.findTotalExpensesByLastMonth(userId).orElse(BigDecimal.ZERO));

        //Actualizar los campos de los gastos por categoria
        monthlyRecord.setTotal_culture_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.CULTURA).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_survival_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.SUPERVIVENCIA).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_leisure_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.OCIO_Y_VICIO).orElse(BigDecimal.ZERO));
        monthlyRecord.setTotal_extras_expenses(expenseRepo.findTotalExpensesByCategoryAndLastMonth(userId, ExpenseCategory.EXTRAS).orElse(BigDecimal.ZERO));

        // Calcular el total de ahorros real_savings
        BigDecimal realSavings = monthlyRecord.getTotal_income().subtract(monthlyRecord.getTotal_expense());
        monthlyRecord.setReal_savings(realSavings);

        // Guardar el registro mensual actualizado en la base de datos
        monthlyRecordRepo.save(monthlyRecord);

        return monthlyRecord;
    }

}