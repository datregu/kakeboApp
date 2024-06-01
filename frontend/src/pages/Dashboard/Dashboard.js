import React, {useEffect, useState, useContext} from "react";
import ExpenseTable from "../../components/ExpenseTable/ExpenseTable";
import Header from "../../components/Header/Header";
import {Box, Tab, Tabs, Typography } from "@mui/material";
import AddExpense from "../AddExpense/AddExpense";
import AddIncome from "../../components/AddIncome/AddIncome";
import IncomeTable from "../../components/IncomeTable/IncomeTable";
import MonthlyRecord from "../../components/MonthRecord/MonthlyRecord";
import FixedExpenseTable from "../../components/FixedExpenseTable/FixedExpenseTable";
import UserContext from "../../components/UserContext/UserContext";
import MoneyWidget from "../../components/MoneyWidget/MoneyWidget";
import style from "./Dashboard.css";
import AddFixedExpense from "../../components/AddFixedExpense/AddFixedExpense";
import PersonalBudgetWidget from "../../components/PersonalBudgetWidget/PersonalBudgetWidget";
import SavingsGoal from '../../components/SavingGoal/SavingGoal';
import {useFetch, postData} from '../../services/useFetch';
import AnualRecord from '../../components/AnualRecord/AnualRecord';
import {useNavigate} from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    // States for expenses
    const [expenses, setExpenses] = useState([]);
    const [isExpenseCreated, setIsExpenseCreated] = useState(false);
    const [isExpenseUpdated, setIsExpenseUpdated] = useState(false);
    const [isExpenseDeleted, setIsExpenseDeleted] = useState(false);
    const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);

    // States for incomes
    const [incomes, setIncomes] = useState([]);
    const [isIncomeUpdated, setIsIncomeUpdated] = useState(false);
    const [isIncomeDeleted, setIsIncomeDeleted] = useState(false);
    const [isIncomeCreated, setIsIncomeCreated] = useState(false);
    const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);

    // States for fixed expenses
    const [fixedExpenses, setFixedExpenses] = useState([]);
    const [isFixedExpenseUpdated, setIsFixedExpenseUpdated] = useState(false);
    const [isFixedExpenseDeleted, setIsFixedExpenseDeleted] = useState(false);
    const [isFixedExpenseCreated, setIsFixedExpenseCreated] = useState(false);

    // State for the monthly record and desired savings
    const [monthlyRecord, setMonthlyRecord] = useState(null);
    const [desiredSavings, setDesiredSavings] = useState(0);

    // State for annual records
    const [monthlyRecords, setMonthlyRecords] = useState([]);

    // User context
    const {user, setUser} = useContext(UserContext);

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // API Calls
    const {
        data: expensesData,
        loading: loadingExpenses,
        error: errorExpenses
    } = useFetch(`/lastMonthExpenseList/${user ? user.userId : ''}`, [user, isExpenseCreated, isExpenseUpdated, isExpenseDeleted]);
    const {
        data: incomesData,
        loading: loadingIncomes,
        error: errorIncomes
    } = useFetch(`/incomeListLastMonth/${user ? user.userId : ''}`, [user, isIncomeCreated, isIncomeUpdated, isIncomeDeleted]);
    const {
        data: monthlyRecordData,
        loading: loadingMonthlyRecord,
        error: errorMonthlyRecord
    } = useFetch(`/getLatestMonthlyRecordv2/${user ? user.userId : ''}`, [user]);
    const {
        data: fixedExpensesData,
        loading: loadingFixedExpenses,
        error: errorFixedExpenses
    } = useFetch(`/fixedExpenseListLastMonth/${user ? user.userId : ''}`, [user, isFixedExpenseCreated, isFixedExpenseUpdated, isFixedExpenseDeleted]);
    const {
        data: totalExpenseMonthData,
        loading: loadingTotalExpenseMonth,
        error: errorTotalExpenseMonth
    } = useFetch(`/totalExpenseByLastMonth/${user ? user.userId : ''}`, [user]);
    const {
        data: totalIncomeMonthData,
        loading: loadingTotalIncomeMonth,
        error: errorTotalIncomeMonth
    } = useFetch(`/totalIncomeByLastMonth/${user ? user.userId : ''}`, [user]);
    const {
        data: monthlyRecordsData,
        loading: loadingMonthlyRecords,
        error: errorMonthlyRecords
    } = useFetch(`/getAllMonthlyRecords/${user ? user.userId : ''}`, [user]);

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

    useEffect(() => {
        if (monthlyRecordsData) setMonthlyRecords(monthlyRecordsData);
    }, [monthlyRecordsData]);

    const handleSavingsChange = (newSavings) => {
        setDesiredSavings(newSavings);
        // Navega a una ruta temporal y luego regresa al Dashboard
        navigate('/refresh');
        setTimeout(() => {
            navigate('/dashboard');
        }, 10);
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, [setUser]);

    if (!user) {
        return <div>Usuario no detectado</div>; // Or your loading spinner
    }

    if (loadingExpenses || loadingIncomes || loadingMonthlyRecord || loadingFixedExpenses || loadingTotalExpenseMonth || loadingTotalIncomeMonth || loadingMonthlyRecords) {
        return <div>Cargando datos...</div>;
    }

    if (errorExpenses || errorIncomes || errorMonthlyRecord || errorFixedExpenses || errorTotalExpenseMonth || errorTotalIncomeMonth || errorMonthlyRecords) {
        return <div>Error al cargar los datos de la API</div>;
    }

    return (
        <>
            <Header/>
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
                    <Typography className="cabin-sketch-bold">
                        Ingresos
                    </Typography>
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
                    <Typography className="cabin-sketch-bold">
                        Gastos Fijos
                    </Typography>
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
                    <Typography className="cabin-sketch-bold">
                        Gastos Diarios
                    </Typography>
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
         <MonthlyRecord record={monthlyRecord} />
        </Box>*/}
                    <Box className="resumeBox">
                        <Tabs value={tabValue} onChange={handleTabChange} TabIndicatorProps={{style: {background:'#a3966a', color:'#895d2b',}}}
                        >
                            <Tab label="PersonalBudget"   sx={{
                                '&.Mui-selected': {
                                    color: '#482e1d', // Change this to the color you want for the selected tab
                                },
                            }}/>
                            <Tab label="Resumen Mensual" sx={{
                                '&.Mui-selected': {
                                    color: '#482e1d', // Change this to the color you want for the selected tab
                                },
                            }}/>
                            <Tab label="Resumen Anual" sx={{
                                '&.Mui-selected': {
                                    color: '#482e1d', // Change this to the color you want for the selected tab
                                },
                            }}/>
                        </Tabs>
                        {tabValue === 0 && (
                            <PersonalBudgetWidget
                                amount={
                                    monthlyRecord
                                        ? monthlyRecord.total_income -
                                        monthlyRecord.fixed_expenses -
                                        monthlyRecord.desired_savings
                                        : 0
                                }
                            />
                        )}
                        {
                            tabValue === 1 && (
                                <MonthlyRecord record={monthlyRecord} expenses={expenses}/>
                            )

                        }
                        {tabValue === 2 && (
                            <AnualRecord records={monthlyRecords}/>
                        )}
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default Dashboard;
