import React, {useEffect, useState} from 'react';
import ExpenseTable from '../../components/ExpenseTable/ExpenseTable';
import Header from '../../components/Header/Header'
import style from './Dashboard.css';

import {Box, Link} from "@mui/material";
import AddExpense from "../AddExpense/AddExpense";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [isExpenseDeleted, setIsExpenseDeleted] = useState(false);
    const userId = 1;

    useEffect(() => {
        fetch('http://localhost:8080/api/expenseList/1')
            .then(response => response.json())
            .then(data => setExpenses(data.slice(0, 10))) // Tomamos solo los primeros 10 elementos
            .catch(error => console.error('Error:', error));
    }, [isExpenseDeleted]);

    return (
        <>
            <Header/>
            <Box className="containerDashboard">
                <Box className="expenseTableContainer">
                    <ExpenseTable expenses={expenses} />
                </Box>

                <Box className="addExpenseButtonContainer">
                    <AddExpense userId={1}/>
                </Box>

            </Box>
        </>
    );
}

export default Dashboard;