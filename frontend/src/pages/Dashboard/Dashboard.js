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
import style from "./Dashboard.css"; // Make sure this import is correctly used

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

  const [monthlyRecord, setMonthlyRecord] = useState(null);

  // Contexto de usuario
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8080/api/expenseList/${user.userId}`)
        .then((response) => response.json())
        .then((data) => setExpenses(data))
        .catch((error) => console.error("Error:", error));

      fetch(`http://localhost:8080/api/incomeListByMonth/${user.userId}`)
        .then((response) => response.json())
        .then((data) => setIncomes(data))
        .catch((error) => console.error("Error:", error));

      fetch(`http://localhost:8080/api/getMonthlyRecord/${user.userId}`)
        .then((response) => response.json())
        .then((data) => setMonthlyRecord(data))
        .catch((error) => console.error("Error:", error));

      fetch(
        `http://localhost:8080/api/expenseListFixedLastMonth/${user.userId}`,
      )
        .then((response) => response.json())
        .then((data) => setFixedExpenses(data))
        .catch((error) => console.error("Error:", error));

      fetch(`http://localhost:8080/api/totalExpenseByLastMonth/${user.userId}`)
        .then((response) => response.json())
        .then((data) => setTotalExpenseMonth(data))
        .catch((error) => console.error("Error:", error));

      fetch(`http://localhost:8080/api/totalIncomeByLastMonth/${user.userId}`)
        .then((response) => response.json())
        .then((data) => setTotalIncomeMonth(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [
    user,
    isExpenseCreated,
    isExpenseUpdated,
    isExpenseDeleted,
    isIncomeDeleted,
    isIncomeUpdated,
    isIncomeCreated,
    isFixedExpenseCreated,
    isFixedExpenseDeleted,
    isFixedExpenseUpdated,
  ]);

  if (!user) {
    return <div>Usuario no detectado</div>; // Or your loading spinner
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
          />
          <Box className="incomeResume">
            <AddIncome
              userId={user.userId}
              setIsIncomeCreated={setIsIncomeCreated}
            />
            <MoneyWidget amount={totalIncomeMonth} />
          </Box>
          <b>Gastos Fijos</b>
          <FixedExpenseTable
            fixedExpenses={fixedExpenses}
            userId={user.userId}
            setIsFixedExpenseUpdated={setIsFixedExpenseUpdated}
            setIsFixedExpenseDeleted={setIsFixedExpenseDeleted}
          />
          <div>Total Gastos Fijos: €</div>
          <div>Presupuesto mensual inicial: €</div>
          <div>Ahorro objetivo: €</div>
          <div>Presupuesto mensual final: €</div>
        </Box>

        <Box className="rightBar">
          <b>Gastos Diarios</b>
          <ExpenseTable
            expenses={expenses}
            userId={user.userId}
            setIsExpenseUpdated={setIsExpenseUpdated}
            setIsExpenseDeleted={setIsExpenseDeleted}
          />
          <Box className="expenseResume">
            <AddExpense
              userId={user.userId}
              setIsExpenseCreated={setIsExpenseCreated}
            />
            <MoneyWidget
              amount={monthlyRecord ? monthlyRecord.total_expense : 0}
            />
          </Box>
          <Box className="monthlyRecord">
            <MonthlyRecord record={monthlyRecord} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
