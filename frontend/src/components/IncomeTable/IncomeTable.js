import React, { useState, useEffect } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar} from '@mui/material';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ModalWindowUpdateIncome from '../../components/ModalWindowUpdateIncome/ModalWindowUpdateIncome';

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function IncomeTable({ incomes, userId, tableSize, setIsIncomeDeleted, setIsIncomeUpdated }) {


    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    function handleDeleteIncome(incomeId) {
        const userConfirmation = window.confirm('¿Estás seguro de que quieres borrar este ingreso?');
        if (userConfirmation) {
            fetch(`http://localhost:8080/api/deleteIncome/${incomeId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        alert('No se ha podido eliminar el ingreso')
                    }
                    setIsIncomeDeleted(prevState => !prevState);
                    //Abrir snackbar de eliminación
                    setSnackbarOpen(true);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (income, userId) => {
        setIncomeToEdit(income);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    const [incomeToEdit, setIncomeToEdit] = useState(null);


    return (
        <TableContainer component={Paper} className="income-table"
                        style={{width: tableSize?.width || '30%', height: tableSize?.height || '100%'}}
        >
            <Table>
                <TableHead className="table-head">
                    <TableRow>
                        <TableCell
                            sx={{color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD'}}
                        >Fecha</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD'}}
                            align="right">Cantidad</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD'}}
                            align="right">Descripción</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD'}}
                            align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {incomes.map((income) => (
                        <TableRow key={income.incomeId}>
                            <TableCell component="th"
                                       scope="row"
                                       style={{backgroundColor: '#A2CD32', fontSize: '1rem'}}
                            >
                                {income.incomeDate}
                            </TableCell>
                            <TableCell align="right"
                                       style={{backgroundColor: '#A2CD32', fontSize: '1rem'}}
                            >{income.incomeAmount}</TableCell>
                            <TableCell align="right"
                                       style={{backgroundColor: '#A2CD32', fontSize: '1rem'}}
                            >{income.incomeDescription}</TableCell>
                            <TableCell style={{
                                backgroundColor: '#A2CD32',
                                display: 'flex',
                                justifyContent: 'space-around'
                            }}>
                                <EditOutlinedIcon
                                    style={{cursor: 'pointer', color: 'white'}}
                                    onClick={() => handleOpenModal(income, userId)}
                                />
                                <ModalWindowUpdateIncome
                                    open={isModalOpen}
                                    handleClose={handleCloseModal}
                                    title="Editar ingreso"
                                    expense={incomeToEdit}
                                    setIsIncomeUpdated={setIsIncomeUpdated}
                                />

                                <DeleteOutlineOutlinedIcon
                                    style={{cursor: 'pointer', color: 'white'}}
                                    onClick={() => handleDeleteIncome(income.incomeId)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Se ha eliminado el ingreso"
            />
        </TableContainer>
    );
}

export default IncomeTable;