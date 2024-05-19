import React, {useEffect, useState} from 'react';
import ExpenseTable from '../../components/ExpenseTable/ExpenseTable';
import Header from '../../components/Header/Header'
import style from  './Dashboard.css';

import {Box} from "@mui/material";
import AddExpense from "../AddExpense/AddExpense";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [isExpenseCreated, setIsExpenseCreated] = useState(false);
    const [isExpenseUpdated, setIsExpenseUpdated] = useState(false);

    const userId = 1;

    useEffect(() => {
        fetch('http://localhost:8080/api/expenseList/1')
            .then(response => response.json())
            .then(data => setExpenses(data)) // Tomamos solo los primeros 10 elementos
            .catch(error => console.error('Error:', error));
    }, [isExpenseCreated, isExpenseUpdated]);

    return (
        <>
            <Header/>
            <Box className="containerDashboard">
                <Box className="expenseTableContainer">
                    <ExpenseTable expenses={expenses}
                                  userId={userId}
                                  setIsExpenseUpdated={setIsExpenseUpdated}
                    />
                </Box>

                <Box className="addExpenseButtonContainer">
                    <AddExpense
                        userId={1}
                        setIsExpenseCreated={setIsExpenseCreated}/>
                </Box>

            </Box>
        </>
    );
}

export default Dashboard;