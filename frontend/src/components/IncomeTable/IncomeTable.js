import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar } from '@mui/material';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ModalWindowUpdateIncome from '../../components/ModalWindowUpdateIncome/ModalWindowUpdateIncome';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function IncomeTable({ incomes, userId, tableSize, setIsIncomeDeleted, setIsIncomeUpdated }) {

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [incomeToEdit, setIncomeToEdit] = useState(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleDeleteIncome = (incomeId) => {
        const userConfirmation = window.confirm('¿Estás seguro de que quieres borrar este ingreso?');
        if (userConfirmation) {
            fetch(`http://localhost:8080/api/deleteIncome/${incomeId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        alert('No se ha podido eliminar el ingreso');
                    } else {
                        setIsIncomeDeleted(prevState => !prevState);
                        setSnackbarOpen(true);
                    }
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        }
    };

    const handleOpenModal = (income) => {
        setIncomeToEdit(income);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIncomeToEdit(null);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    return (
        <TableContainer component={Paper} className="income-table"
                        style={{ width: tableSize?.width || '40%', height: tableSize?.height || '100%' }}
        >
            <Table>
                <TableHead className="table-head">
                    <TableRow>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD' }}>Fecha</TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD' }} align="right">Cantidad</TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD' }} align="right">Descripción</TableCell>
                        <TableCell sx={{ color: 'white', fontSize: '1rem', backgroundColor: '#5D32CD' }} align="right">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {incomes.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((income) => (
                        <TableRow key={income.incomeId}>
                            <TableCell component="th" scope="row" style={{ backgroundColor: '#A2CD32', fontSize: '0.7rem' }}>
                                {income.incomeDate}
                            </TableCell>
                            <TableCell align="right" style={{ backgroundColor: '#A2CD32', fontSize: '0.7rem' }}>
                                {income.incomeAmount}
                            </TableCell>
                            <TableCell align="right" style={{ backgroundColor: '#A2CD32', fontSize: '0.7rem' }}>
                                {income.incomeDescription}
                            </TableCell>
                            <TableCell style={{ backgroundColor: '#A2CD32', display: 'flex', justifyContent: 'space-around' }}>
                                <EditOutlinedIcon
                                    style={{ cursor: 'pointer', color: 'white' }}
                                    onClick={() => handleOpenModal(income)}
                                />
                                <DeleteOutlineOutlinedIcon
                                    style={{ cursor: 'pointer', color: 'white' }}
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
            {incomeToEdit && (
                <ModalWindowUpdateIncome
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    title="Editar ingreso"
                    income={incomeToEdit}
                    setIsIncomeUpdated={setIsIncomeUpdated}
                />
            )}
        </TableContainer>
    );
}

export default IncomeTable;
