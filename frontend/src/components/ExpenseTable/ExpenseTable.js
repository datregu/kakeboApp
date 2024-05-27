import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Popover,
    IconButton,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ModalWindow from "../../components/ModalWindowUpdateExpense/ModalWindow";

function formatCategory(category) {
    return category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

const categoryColors = {
    "Ocio Y Vicio": "#118ab2",
    Cultura: "#06d6a0",
    Supervivencia: "#ffd166",
    Extras: "#ef476f",
};

function ExpenseTable({
                          expenses,
                          tableSize,
                          userId,
                          setIsExpenseUpdated,
                          setIsExpenseDeleted,
                      }) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleDeleteExpense = (expenseId) => {
        const userConfirmation = window.confirm(
            "¿Estás seguro de que quieres borrar este gasto?",
        );
        if (userConfirmation) {
            fetch(`http://localhost:8080/api/delete/${expenseId}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) {
                        alert("No se ha podido eliminar el gasto");
                    }
                    setIsExpenseDeleted((prevState) => !prevState);
                    //Abrir snackbar de eliminación
                    setSnackbarOpen(true);
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation:",
                        error,
                    );
                });
        }
    };

    const handleOpenModal = (expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
        setAnchorEl(null); // Cierra el Popover al abrir el modal
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleRowClick = (event, expense) => {
        setAnchorEl(event.currentTarget);
        setExpenseToEdit(expense);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <TableContainer
            component={Paper}
            className="expense-table"
            style={{
                width: tableSize?.width || "100%",
                height: 350,
                border: "3px solid #a3966a",
            }}
        >
            <Table size="small" stickyHeader>
                <TableHead className="table-head">
                    <TableRow>
                        <TableCell
                            sx={{
                                color: "white",
                                fontSize: "1.5rem",
                                backgroundColor: "#a3966a",
                                textAlign: "center",
                                borderBottom: "2px solid #a3966a",
                            }}
                        >
                            Categoría
                        </TableCell>
                        <TableCell
                            sx={{
                                color: "white",
                                fontSize: "1.5rem",
                                backgroundColor: "#a3966a",
                                textAlign: "center",
                                borderBottom: "2px solid #a3966a",
                            }}
                        >
                            Descripción
                        </TableCell>
                        <TableCell
                            sx={{
                                color: "white",
                                fontSize: "1.5rem",
                                backgroundColor: "#a3966a",
                                textAlign: "center",
                                borderBottom: "2px solid #a3966a",
                            }}
                        >
                            Fecha
                        </TableCell>
                        <TableCell
                            sx={{
                                color: "white",
                                fontSize: "1.5rem",
                                backgroundColor: "#a3966a",
                                textAlign: "center",
                                borderBottom: "2px solid #a3966a",
                            }}
                        >
                            Cantidad
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(expenses) &&
                        expenses.map((expense) => {
                            const category = formatCategory(expense.expenseCategory);
                            const color = categoryColors[category];
                            return (
                                <TableRow
                                    key={expense.expenseId}
                                    style={{ backgroundColor: color, height: "50px", cursor: "pointer" }}
                                    onClick={(event) => handleRowClick(event, expense)}
                                >
                                    <TableCell
                                        style={{
                                            backgroundColor: color,
                                            fontSize: "1rem",
                                            borderTop: "2px solid #a3966a",
                                            borderBottom: "2px solid #a3966a",
                                            textAlign: "center",
                                        }}
                                    >
                                        {category}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            backgroundColor: color,
                                            fontSize: "1rem",
                                            borderTop: "2px solid #a3966a",
                                            borderBottom: "2px solid #a3966a",
                                            textAlign: "center",
                                        }}
                                    >
                                        {expense.expenseDescription}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            backgroundColor: color,
                                            fontSize: "1rem",
                                            borderTop: "2px solid #a3966a",
                                            borderBottom: "2px solid #a3966a",
                                            textAlign: "center",
                                        }}
                                    >
                                        {expense.expenseDate}
                                    </TableCell>
                                    <TableCell
                                        style={{
                                            backgroundColor: color,
                                            fontSize: "1rem",
                                            borderTop: "2px solid #a3966a",
                                            borderBottom: "2px solid #a3966a",
                                            textAlign: "center",
                                        }}
                                    >
                                        {expense.expenseAmount} €
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div style={{ display: 'flex', padding: '10px' }}>
                    <IconButton onClick={() => handleOpenModal(expenseToEdit)}>
                        <EditOutlinedIcon style={{ color: "black" }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteExpense(expenseToEdit.expenseId)}>
                        <DeleteOutlineOutlinedIcon style={{ color: "black" }} />
                    </IconButton>
                </div>
            </Popover>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message="Se ha eliminado el gasto"
            />
            {expenseToEdit && (
                <ModalWindow
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    title="Editar gasto"
                    expense={expenseToEdit}
                    setIsExpenseUpdated={setIsExpenseUpdated}
                />
            )}
        </TableContainer>
    );
}

export default ExpenseTable;
