import React, { useEffect, useState, useContext } from "react";
import ExpenseTable from "../../components/ExpenseTable/ExpenseTable";
import Header from "../../components/Header/Header";
import { Box } from "@mui/material";
import AddExpense from "../AddExpense/AddExpense";
import AddIncome from "../../components/AddIncome/AddIncome";
import IncomeTable from "../../components/IncomeTable/IncomeTable";
import MonthlyRecord from "../../components/MonthRecord/MonthlyRecord";
import FixedExpenseTable from "../../components/FixedExpenseTable/FixedExpenseTable";
import UserContext from "../../components/UserContext/UserContext";
import MoneyWidget from "../../components/MoneyWidget/MoneyWidget";
import style from "./Dashboard.css"; // Asegúrate de que esta importación se use correctamente
import AddFixedExpense from "../../components/AddFixedExpense/AddFixedExpense";
import PersonalBudgetWidget from "../../components/PersonalBudgetWidget/PersonalBudgetWidget";
import SavingsGoal from '../../components/SavingGoal/SavingGoal';
import { useFetch, postData } from '../../services/useFetch';

function Dashboard() {
  // Estados para gastos
  const [expenses, setExpenses] = useState([]);
  const [isExpenseCreated, setIsExpenseCreated] = useState(false);
  const [isExpenseUpdated, setIsExpenseUpdated] = useState(false);
  const [isExpenseDeleted, setIsExpenseDeleted] = useState(false);
  const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);

  // Estados para ingresos
  const [incomes, setIncomes] = useState([]);
  const [isIncomeUpdated, setIsIncomeUpdated] = useState(false);
  const [isIncomeDeleted, setIsIncomeDeleted] = useState(false);
  const [isIncomeCreated, setIsIncomeCreated] = useState(false);
  const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);

  // Estados para gastos fijos
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [isFixedExpenseUpdated, setIsFixedExpenseUpdated] = useState(false);
  const [isFixedExpenseDeleted, setIsFixedExpenseDeleted] = useState(false);
  const [isFixedExpenseCreated, setIsFixedExpenseCreated] = useState(false);

  // Estado para el registro mensual y ahorro deseado
  const [monthlyRecord, setMonthlyRecord] = useState(null);
  const [desiredSavings, setDesiredSavings] = useState(0);

  // Contexto de usuario
  const { user, setUser } = useContext(UserContext);

  const { data: expensesData, loading: loadingExpenses, error: errorExpenses } = useFetch(`/expenseList/${user ? user.userId : ''}`, [user, isExpenseCreated, isExpenseUpdated, isExpenseDeleted]);
  const { data: incomesData, loading: loadingIncomes, error: errorIncomes } = useFetch(`/incomeListByMonth/${user ? user.userId : ''}`, [user, isIncomeCreated, isIncomeUpdated, isIncomeDeleted]);
  const { data: monthlyRecordData, loading: loadingMonthlyRecord, error: errorMonthlyRecord } = useFetch(`/getMonthlyRecord/${user ? user.userId : ''}`, [user]);
  const { data: fixedExpensesData, loading: loadingFixedExpenses, error: errorFixedExpenses } = useFetch(`/expenseListFixedLastMonth/${user ? user.userId : ''}`, [user, isFixedExpenseCreated, isFixedExpenseUpdated, isFixedExpenseDeleted]);
  const { data: totalExpenseMonthData, loading: loadingTotalExpenseMonth, error: errorTotalExpenseMonth } = useFetch(`/totalExpenseByLastMonth/${user ? user.userId : ''}`, [user]);
  const { data: totalIncomeMonthData, loading: loadingTotalIncomeMonth, error: errorTotalIncomeMonth } = useFetch(`/totalIncomeByLastMonth/${user ? user.userId : ''}`, [user]);

  useEffect(() => {
    if (expensesData) setExpenses(expensesData);
  }, [expensesData]);

  useEffect(() => {
    if (incomesData) setIncomes(incomesData);
  }, [incomesData]);

  useEffect(() => {
    if (monthlyRecordData) {
      setMonthlyRecord(monthlyRecordData);
      setDesiredSavings(monthlyRecordData.desired_savings);
    }
  }, [monthlyRecordData]);

  useEffect(() => {
    if (fixedExpensesData) setFixedExpenses(fixedExpensesData);
  }, [fixedExpensesData]);

  useEffect(() => {
    if (totalExpenseMonthData) setTotalExpenseMonth(totalExpenseMonthData);
  }, [totalExpenseMonthData]);

  useEffect(() => {
    if (totalIncomeMonthData) setTotalIncomeMonth(totalIncomeMonthData);
  }, [totalIncomeMonthData]);

  const handleSavingsChange = (newSavings) => {
    setDesiredSavings(newSavings);
    postData(`/setDesiredSavings?userId=${user.userId}&month=5&year=2024&desiredSavings=${newSavings}`, {})
        .then(() => fetch(`/getMonthlyRecord/${user.userId}`))
        .then((response) => response.json())
        .then((data) => {
          setMonthlyRecord(data);
        })
        .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  if (!user) {
    return <div>Usuario no detectado</div>; // O tu spinner de carga
  }

  if (loadingExpenses || loadingIncomes || loadingMonthlyRecord || loadingFixedExpenses || loadingTotalExpenseMonth || loadingTotalIncomeMonth) {
    return <div>Cargando datos...</div>;
  }

  if (errorExpenses || errorIncomes || errorMonthlyRecord || errorFixedExpenses || errorTotalExpenseMonth || errorTotalIncomeMonth) {
    return <div>Error al cargar los datos.</div>;
  }

  return (
      <>
        <Header />
        <Box className="containerDashboard">
          <Box
              className="leftBar"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
              }}
          >
            <b>Ingresos</b>
            <IncomeTable
                incomes={incomes}
                userId={user.userId}
                setIsIncomeDeleted={setIsIncomeDeleted}
                setIsIncomeUpdated={setIsIncomeUpdated}
                isIncomeCreated={isIncomeCreated}
                setIncomes={setIncomes}
            />
            <Box className="incomeResume">
              {/* <AddIncome
                userId={user.userId}
                setIsIncomeCreated={setIsIncomeCreated}
            />
            <MoneyWidget amount={totalIncomeMonth} />*/}
            </Box>
            <b>Gastos Fijos</b>
            <FixedExpenseTable
                fixedExpenses={fixedExpenses}
                userId={user.userId}
                setIsFixedExpenseUpdated={setIsFixedExpenseUpdated}
                setIsFixedExpenseDeleted={setIsFixedExpenseDeleted}
            />
            {/* <AddFixedExpense
              userId={user.userId}
              setIsFixedExpenseCreated={setIsFixedExpenseCreated}
          />*/}
            <SavingsGoal
                monthlyRecord={monthlyRecord}
                onSavingsChange={handleSavingsChange}
            />
          </Box>
          <Box className="rightBar">
            <b>Gastos Diarios</b>
            <ExpenseTable
                expenses={expenses}
                userId={user.userId}
                setIsExpenseUpdated={setIsExpenseUpdated}
                setIsExpenseDeleted={setIsExpenseDeleted}
                isExpenseCreated={isExpenseCreated}
                setExpenses={setExpenses}
            />
            {/* <Box className="expenseResume">
            <AddExpense
                userId={user.userId}
                setIsExpenseCreated={setIsExpenseCreated}
            />
            <MoneyWidget
                amount={monthlyRecord ? monthlyRecord.total_expense : 0}
            />
          </Box>*/}
            <Box className="monthlyRecord">
              <MonthlyRecord record={monthlyRecord} />
              <PersonalBudgetWidget
                  amount={
                    monthlyRecord
                        ? monthlyRecord.total_income -
                        monthlyRecord.fixed_expenses -
                        monthlyRecord.desired_savings
                        : 0
                  }
              />
            </Box>
          </Box>
        </Box>
      </>
  );
}

export default Dashboard;
