import React, {useState} from 'react';
import {TextField, Snackbar, MenuItem, Select, Box} from '@mui/material';
import style from './AddExpense.css';

function AddExpense({userId}) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [expenseData, setExpenseData] = useState({
        expenseAmount: '',
        expenseDate: new Date(),
        expenseDescription: '',
        expenseCategory: ''
    });
    const categories = [
        {value: 'CULTURA', label: 'Cultura'},
        {value: 'OCIO_Y_VICIO', label: 'Ocio y Vicio'},
        {value: 'EXTRAS', label: 'Extras   '},
        {value: 'SUPERVIVENCIA', label: 'Supervivencia'},
    ];

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleChange = (event) => {
        setExpenseData({
            ...expenseData,
            [event.target.name]: event.target.value
        });
    };

    const createExpense = () => {
        const expenseDataToSend = {
            ...expenseData,
            expenseDate: expenseData.expenseDate.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }).replace(/\//g, '-')
        };
        fetch(`http://localhost:8080/api/createExpense/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseDataToSend),
        })
            .then(response => {
                if (response.ok) {
                    return response.text().then(text => {
                        return text ? JSON.parse(text) : {}
                    })
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                console.log('Success:', data);
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <Box
            style={{
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem'
            }}
            >
            <h2>
                Añadir gasto
            </h2>

            <TextField name="expenseAmount" label="Cantidad" value={expenseData.expenseAmount} onChange={handleChange}/>

            <input
                type="date"
                value={expenseData.expenseDate.toISOString().substr(0, 10)}
                onChange={(event) => {
                    setExpenseData({
                        ...expenseData,
                        expenseDate: new Date(event.target.value)
                    });
                }}
            />

            <TextField name="expenseDescription" label="Descripción" value={expenseData.expenseDescription}
                       onChange={handleChange}/>

            <Select
                value={expenseData.expenseCategory}
                onChange={handleChange}
                name="expenseCategory"
            >
                {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                        {category.label}
                    </MenuItem>
                ))}
            </Select>

            <button type="button" onClick={createExpense}>
                Crear
            </button>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Se ha añadido un nuevo gasto"
            />
        </Box>
    );
}

export default AddExpense;