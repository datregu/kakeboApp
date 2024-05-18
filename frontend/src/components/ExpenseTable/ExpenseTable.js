import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import Pagination from "@mui/material/Pagination";
import styles from './ExpenseTable.css';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


function formatCategory(category) {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

const categoryColors = {
    'Ocio Y Vicio': '#118ab2',
    'Cultura': '#06d6a0',
    'Supervivencia': '#ffd166',
    'Extras': '#ef476f'
};

function ExpenseTable({expenses, tableSize}) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

function handleDeleteExpense(expenseId) {
    const userConfirmation = window.confirm('¿Estás seguro de que quieres borrar este gasto?');
    if (userConfirmation) {
        fetch(`http://localhost:8080/api/delete/${expenseId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                alert('No se ha podido eliminar el gasto')
            }
            alert('Gasto eliminado correctamente');
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }
}

    return (
        <TableContainer component={Paper} className="expense-table" style={{width: tableSize?.width || '100%', height: tableSize?.height || '100%'}}>
            <Table>
                <TableHead className="table-head">
                    <TableRow>
                        <TableCell
                        sx={{color: 'white', fontSize: '1.5rem'}}
                        >Categoria</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem'}}
                        >Descripción</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem'}}
                        >Fecha</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem'}}
                        >Cantidad</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem'}}
                        >Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.slice((page -1 ) * rowsPerPage, page * rowsPerPage).map(expense => {
                        const category = formatCategory(expense.expenseCategory);
                        const color = categoryColors[category];
                        return (
                            <TableRow key={expense.expenseId}>
                                <TableCell style={{backgroundColor: color, fontSize: '1rem'}}>{category}</TableCell>
                                <TableCell style={{backgroundColor: color}}>{expense.expenseDescription}</TableCell>
                                <TableCell style={{backgroundColor: color}}>{expense.expenseDate}</TableCell>
                                <TableCell style={{backgroundColor: color, fontSize: '1rem'}}>{expense.expenseAmount} €</TableCell>
                                <TableCell style={{
                                    backgroundColor: color,
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}>
                                    <EditOutlinedIcon
                                        style={{cursor: 'pointer', color:'white'}}

                                    />
                                    <DeleteOutlineOutlinedIcon
                                        style={{cursor: 'pointer', color:'white'}}
                                    onClick={() => handleDeleteExpense(expense.expenseId)}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination count={Math.ceil(expenses.length / rowsPerPage)} page={page} onChange={handleChangePage} />
        </TableContainer>
    );
}

export default ExpenseTable;