// src/pages/Dashboard/Dashboard.js

import React, {useEffect, useState, useContext} from 'react';
import ExpenseTable from '../../components/ExpenseTable/ExpenseTable';
import Header from '../../components/Header/Header'
import style from  './Dashboard.css';
import UserContext from "../../components/UserContext/UserContext";
import {Box} from "@mui/material";
import AddExpense from "../AddExpense/AddExpense";
import IncomeTable from "../../components/IncomeTable/IncomeTable";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [isExpenseCreated, setIsExpenseCreated] = useState(false);
    const [isExpenseUpdated, setIsExpenseUpdated] = useState(false);
    const [isExpenseDeleted, setIsExpenseDeleted] = useState(false);
    const [incomes, setIncomes] = useState([]);
    const [isIncomeUpdated, setIsIncomeUpdated] = useState(false);
    const [isIncomeDeleted, setIsIncomeDeleted] = useState(false);

    const {user, setUser} = useContext(UserContext);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    useEffect(() => {
    if (user) {
        fetch(`http://localhost:8080/api/expenseList/${user.userId}`)
            .then(response => response.json())
            .then(data => setExpenses(data))
            .catch(error => console.error('Error:', error));

        fetch(`http://localhost:8080/api/incomeListByMonth/${user.userId}`)
            .then(response => response.json())
            .then(data => setIncomes(data))
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    }
}, [user, isExpenseCreated, isExpenseUpdated, isExpenseDeleted, isIncomeDeleted, isIncomeUpdated]);


    if (!user) {
        return <div>Usuario no detectado</div>; // Or your loading spinner
    }

    return (
        <>
            <Header/>
            <Box className="containerDashboard">
                <Box className="expenseTableContainer">
                    <IncomeTable incomes={incomes}
                                 userId={user.userId}
                                 setIsIncomeDeleted={setIsIncomeDeleted}
                                 setIsIncomeUpdated={setIsIncomeUpdated}
                    />
                    <ExpenseTable expenses={expenses}
                                  userId={user.userId}
                                  setIsExpenseUpdated={setIsExpenseUpdated}
                                  setIsExpenseDeleted={setIsExpenseDeleted}

                    />


                </Box>
                <Box className="buttonsContainer">
                    <AddExpense
                        userId={user.userId}
                        setIsExpenseCreated={setIsExpenseCreated}/>
                </Box>

            </Box>
        </>
    );
}

export default Dashboard;