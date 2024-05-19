import React, {useState} from 'react';
import {TextField, Snackbar, MenuItem, Select, Box, InputLabel, Fab, Modal} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function AddExpense({userId, setIsExpenseCreated}) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const initialExpenseData = {
        expenseAmount: '',
        expenseDate: new Date(),
        expenseDescription: '',
        expenseCategory: ''
    };
    const [expenseData, setExpenseData] = useState(initialExpenseData);


    const categories = [
        {value: 'SUPERVIVENCIA', label: 'Supervivencia'},
        {value: 'OCIO_Y_VICIO', label: 'Ocio y Vicio'},
        {value: 'CULTURA', label: 'Cultura'},
        {value: 'EXTRAS', label: 'Extras   '},
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

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
        const userConfirmation = window.confirm('¿Estás seguro de que quieres crear este gasto?');
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
                if (userConfirmation) {
                    setIsExpenseCreated(prevState => !prevState);
                    setExpenseData(initialExpenseData);
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
        <>
            <Fab
                size="small"
                color="primary"
                variant="extended"
                onClick={handleOpenModal}>
                <AddIcon />Añadir gasto
            </Fab>

            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
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

                    <TextField
                        value={expenseData.expenseCategory}
                        onChange={handleChange}
                        name="expenseCategory"
                        select
                        label="Categoría"
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.value} value={category.value}>
                                {category.label}
                            </MenuItem>
                        ))}
                    </TextField>


                    <Fab
                        size="small"
                        color="primary"
                        variant="extended"
                        onClick={createExpense}>
                        Añadir gasto
                    </Fab>


                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleSnackbarClose}
                        message="Se ha añadido un nuevo gasto"
                    />
                </Box>
            </Modal>
        </>
    );
}

export default AddExpense;