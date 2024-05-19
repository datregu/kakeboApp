import React, {useState} from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
import Pagination from "@mui/material/Pagination";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ModalWindow from '../../components/ModalWindow/ModalWindow';


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

function ExpenseTable({expenses, tableSize, userId, setIsExpenseUpdated}) {
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (expense, userId) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);


    return (
        <TableContainer component={Paper} className="expense-table"
                        style={{width: tableSize?.width || '100%', height: tableSize?.height || '100%'}}>
            <Table>
                <TableHead className="table-head">
                    <TableRow>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem', backgroundColor: '#073b4c'}}
                        >Categoría</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem', backgroundColor: '#073b4c'}}
                        >Descripción</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem', backgroundColor: '#073b4c'}}
                        >Fecha</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem', backgroundColor: '#073b4c'}}
                        >Cantidad</TableCell>
                        <TableCell
                            sx={{color: 'white', fontSize: '1.5rem', backgroundColor: '#073b4c'}}
                        >Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {expenses.slice((page - 1) * rowsPerPage, page * rowsPerPage).map(expense => {
                        const category = formatCategory(expense.expenseCategory);
                        const color = categoryColors[category];
                        return (
                            <TableRow key={expense.expenseId}>
                                <TableCell style={{backgroundColor: color, fontSize: '1rem'}}>{category}</TableCell>
                                <TableCell style={{backgroundColor: color}}>{expense.expenseDescription}</TableCell>
                                <TableCell style={{backgroundColor: color}}>{expense.expenseDate}</TableCell>
                                <TableCell style={{
                                    backgroundColor: color,
                                    fontSize: '1rem'
                                }}>{expense.expenseAmount} €</TableCell>
                                <TableCell style={{
                                    backgroundColor: color,
                                    display: 'flex',
                                    justifyContent: 'space-around'
                                }}>
                                    <EditOutlinedIcon
                                        style={{cursor: 'pointer', color: 'white'}}
                                        onClick={() => handleOpenModal(expense, userId)}
                                    />
                                    <ModalWindow
                                        open={isModalOpen}
                                        handleClose={handleCloseModal}
                                        title="Editar gasto"
                                        expense={expenseToEdit}
                                        setIsExpenseUpdated={setIsExpenseUpdated}
                                    />

                                    <DeleteOutlineOutlinedIcon
                                        style={{cursor: 'pointer', color: 'white'}}
                                        onClick={() => handleDeleteExpense(expense.expenseId)}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            <Pagination count={Math.ceil(expenses.length / rowsPerPage)} page={page} onChange={handleChangePage}/>
        </TableContainer>
    );
}

export default ExpenseTable;