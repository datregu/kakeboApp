import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import Pagination from "@mui/material/Pagination";
import styles from './ExpenseTable.css';

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