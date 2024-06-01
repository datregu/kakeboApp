import React, { useState, useEffect } from "react";
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
    Button,
    TextField,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from '@mui/icons-material/Menu';
import ModalWindow from "../../components/ModalWindowUpdateExpense/ModalWindow";
import MoneyWidget from "../../components/MoneyWidget/MoneyWidget";
import { Box } from "@mui/material";
import "./ExpenseTable.css";

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

const categories = [
    { value: "SUPERVIVENCIA", label: "Supervivencia" },
    { value: "OCIO_Y_VICIO", label: "Ocio y Vicio" },
    { value: "CULTURA", label: "Cultura" },
    { value: "EXTRAS", label: "Extras" },
];

const tableCellStyle = {
    fontSize: "1rem",
    borderTop: "2px solid #a3966a",
    borderBottom: "2px solid #a3966a",
    textAlign: "center",
};

const tableHeadStyle = {
    color: "white",
    fontSize: "1rem",
    backgroundColor: "#a3966a",
    textAlign: "center",
};

function ExpenseTable({
                          expenses,
                          tableSize,
                          userId,
                          setIsExpenseUpdated,
                          setIsExpenseDeleted,
                          isExpenseCreated,
                          setExpenses,
                      }) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [newExpense, setNewExpense] = useState({
        expenseAmount: "",
        expenseDate: "",
        expenseDescription: "",
        expenseCategory: "",
    });
    const [monthlyRecord, setMonthlyRecord] = useState(null);

    const [refreshMoneyWidget, setRefreshMoneyWidget] = useState(false);

    useEffect(() => {
        if (isExpenseCreated) {
            fetch(`http://localhost:8080/api/lastMonthExpenseList/${userId}`)
                .then((response) => response.json())
                .then((data) => setExpenses(data))
                .catch((error) => console.error("Error:", error));
        }
    }, [isExpenseCreated, userId, setExpenses]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/getMonthlyRecord/${userId}`)
            .then((response) => response.json())
            .then((data) => setMonthlyRecord(data))
            .catch((error) => console.error("Error:", error));
    }, [userId, refreshMoneyWidget]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleDeleteExpense = (expenseId) => {
        const userConfirmation = window.confirm(
            "¿Estás seguro de que quieres borrar este gasto?"
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
                    setSnackbarOpen(true);
                    setRefreshMoneyWidget((prevState) => !prevState); // Trigger refresh
                    handlePopoverClose();
                })
                .catch((error) => {
                    console.error(
                        "There has been a problem with your fetch operation:",
                        error
                    );
                });
        }
    };

    const handleOpenModal = (expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
        setAnchorEl(null);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    const handleRowClick = (event, expense) => {
        setAnchorEl(event.currentTarget);
        setExpenseToEdit(expense);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleCreateExpense = () => {
        const expenseDataToSend = {
            ...newExpense,
            expenseDate: new Date(newExpense.expenseDate)
                .toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                .replace(/\//g, "-"),
        };

        fetch(`http://localhost:8080/api/createExpense/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(expenseDataToSend),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la creación del gasto");
                }
                setIsCreateModalOpen(false);
                setIsExpenseUpdated((prevState) => !prevState);
                setRefreshMoneyWidget((prevState) => !prevState); // Trigger refresh
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const isPopoverOpen = Boolean(anchorEl);
    const popoverId = isPopoverOpen ? "simple-popover" : undefined;

    return (
        <>
            <TableContainer
                component={Paper}
                className="expense-table"
                style={{
                    width: tableSize?.width || "100%",
                    height: 350,
                    border: "3px solid #a3966a",
                    borderRadius: "10px"
                }}
            >
                <Table size="small" stickyHeader>
                    <TableHead className="table-head">
                        <TableRow>
                            <TableCell sx={tableHeadStyle}>Fecha</TableCell>
                            <TableCell sx={tableHeadStyle}>Descripción</TableCell>
                            <TableCell sx={tableHeadStyle}>Cantidad</TableCell>
                            <TableCell sx={tableHeadStyle}>Categoría</TableCell>
                            <TableCell sx={tableHeadStyle}></TableCell>
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
                                        style={{
                                            backgroundColor: color,
                                            height: "50px",
                                            cursor: "pointer",
                                        }}
                                        onClick={(event) => handleRowClick(event, expense)}
                                    >
                                        <TableCell
                                            style={{
                                                ...tableCellStyle,
                                                backgroundColor: color,
                                            }}
                                        >
                                            {expense.expenseDate}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                ...tableCellStyle,
                                                backgroundColor: color,
                                            }}
                                        >
                                            {expense.expenseDescription}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                ...tableCellStyle,
                                                backgroundColor: color,
                                            }}
                                        >
                                            {expense.expenseAmount} €
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                ...tableCellStyle,
                                                backgroundColor: color,
                                            }}
                                        >
                                         {category}
                                        </TableCell>
                                        <TableCell
                                            style={{
                                                ...tableCellStyle,
                                                backgroundColor: color,
                                            }}
                                        >
                                            <MenuIcon/>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
                <Popover
                    id={popoverId}
                    open={isPopoverOpen}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                    }}
                >
                    <div style={{ display: "flex", padding: "10px" }}>
                        <IconButton onClick={() => handleOpenModal(expenseToEdit)}>
                            <EditOutlinedIcon style={{ color: "black" }} />
                        </IconButton>
                        <IconButton
                            onClick={() => handleDeleteExpense(expenseToEdit.expenseId)}
                        >
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
                <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                    <DialogTitle>Añadir Gasto</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Cantidad"
                            type="number"
                            fullWidth
                            value={newExpense.expenseAmount}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseAmount: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Descripción"
                            type="text"
                            fullWidth
                            value={newExpense.expenseDescription}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseDescription: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            type="date"
                            fullWidth
                            value={newExpense.expenseDate}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Categoría"
                            select
                            fullWidth
                            value={newExpense.expenseCategory}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseCategory: e.target.value })}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCreateModalOpen(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateExpense} color="primary">
                            Añadir
                        </Button>
                    </DialogActions>
                </Dialog>
            </TableContainer>
            <Box className="expenseResume"
                 style={{
                     width: tableSize?.width || "100%",
                     border: "3px solid #a3966a",
                     borderRadius: "10px",
                 }}
            >
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#482e1d",
                        width: "25%",
                        color: "white",
                        margin: "10px",
                        padding: "1px 10px", // Reducción del padding para reducir la altura
                        fontSize: "0.8rem", // Reducción del tamaño de la fuente
                        whiteSpace: "nowrap", // Asegurarse de que el texto no se divida en múltiples líneas
                        '&:hover': {
                            backgroundColor: "#743D2B",
                        }
                    }}
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Añadir Gasto
                </Button>
                <MoneyWidget
                    amount={monthlyRecord ? monthlyRecord.total_expense : 0}
                />
            </Box>
        </>
    );
}

export default ExpenseTable;
