package com.daniel.kakeapp.User;

import com.daniel.kakeapp.User.UserEntity;
import com.daniel.kakeapp.Expense.ExpenseEntity;
import com.daniel.kakeapp.Income.IncomeEntity;
import com.daniel.kakeapp.MonthlyRecord.MonthlyRecordEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserEntityTest {

    private UserEntity userEntity;
// Test para la entidad UserEntity, se comprueba que los métodos get y set funcionan correctamente.
    @BeforeEach
    public void setUp() {
        userEntity = new UserEntity();
    }
// Test para comprobar que el nombre de usuario se establece y se recupera correctamente.
    @Test
    public void userNameIsSetAndRetrievedCorrectly() {
        String userName = "testUser";
        userEntity.setUserName(userName);
        assertEquals(userName, userEntity.getUserName());
    }
// Test para comprobar que la contraseña de usuario se establece y se recupera correctamente.
    @Test
    public void userPasswordIsSetAndRetrievedCorrectly() {
        String userPassword = "testPassword";
        userEntity.setUserPassword(userPassword);
        assertEquals(userPassword, userEntity.getUserPassword());
    }
// Test para comprobar que el correo electrónico del usuario se establece y se recupera correctamente.
    @Test
    public void userEmailIsSetAndRetrievedCorrectly() {
        String userEmail = "testEmail";
        userEntity.setUserEmail(userEmail);
        assertEquals(userEmail, userEntity.getUserEmail());
    }
// Test para comprobar que los gastos se establecen y se recuperan correctamente.
    @Test
    public void expensesAreSetAndRetrievedCorrectly() {
        List<ExpenseEntity> expenses = Arrays.asList(new ExpenseEntity(), new ExpenseEntity());
        userEntity.setExpenses(expenses);
        assertEquals(expenses, userEntity.getExpenses());
    }
// Test para comprobar que los ingresos se establecen y se recuperan correctamente.
    @Test
    public void incomesAreSetAndRetrievedCorrectly() {
        List<IncomeEntity> incomes = Arrays.asList(new IncomeEntity(), new IncomeEntity());
        userEntity.setIncomes(incomes);
        assertEquals(incomes, userEntity.getIncomes());
    }
// Test para comprobar que los registros mensuales se establecen y se recuperan correctamente.
    @Test
    public void monthlyRecordsAreSetAndRetrievedCorrectly() {
        List<MonthlyRecordEntity> monthlyRecords = Arrays.asList(new MonthlyRecordEntity(), new MonthlyRecordEntity());
        userEntity.setMonthlyRecords(monthlyRecords);
        assertEquals(monthlyRecords, userEntity.getMonthlyRecords());
    }
// Test para comprobar que los miembros de la familia se establecen y se recuperan correctamente.
    @Test
    public void familyMembersAreSetAndRetrievedCorrectly() {
        List<String> familyMembers = Arrays.asList("John", "Jane");
        userEntity.setFamilyMembers(familyMembers);
        assertEquals(familyMembers, userEntity.getFamilyMembers());
    }
}