import React, { useEffect, useState } from "react";
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
    DialogTitle,
    Box
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from '@mui/icons-material/Menu';
import ModalWindowUpdateFixedExpense from "../../components/ModalWindowUpdateFixedExpense/ModalWindowUpdateFixedExpense";
import MoneyWidget from "../../components/MoneyWidget/MoneyWidget";
import "./FixedExpenseTable.css";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// Definir objetos de estilo reutilizables
const tableCellStyle = {
    fontSize: "0.8rem",
    textAlign: "center",
    padding: "4px 0",
};

const tableHeadStyle = {
    color: "white",
    fontSize: "1rem",
    backgroundColor: "#a3966a",
    textAlign: "center",
};

function FixedExpenseTable({
                               fixedExpenses,
                               userId,
                               tableSize,
                               setIsFixedExpenseUpdated,
                               setIsFixedExpenseDeleted,
                           }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [totalFixedExpenses, setTotalFixedExpenses] = useState(0);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        expenseAmount: "",
        expenseDate: "",
        expenseDescription: "",
        expenseCategory: "FIXED",
    });

    // Estado para la actualización del widget
    const [refreshMoneyWidget, setRefreshMoneyWidget] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/api/totalFixedExpensesByLastMonth/${userId}`)
            .then((response) => response.json())
            .then((data) => setTotalFixedExpenses(data))
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
            "¿Estás seguro de que quieres borrar este gasto?",
        );
        if (userConfirmation) {
            fetch(`http://localhost:8080/api/delete/${expenseId}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) {
                        alert("No se ha podido eliminar el gasto");
                    } else {
                        setIsFixedExpenseDeleted((prevState) => !prevState);
                        // Abrir snackbar de eliminación
                        setSnackbarOpen(true);
                        // Actualizar MoneyWidget
                        setRefreshMoneyWidget((prevState) => !prevState);
                        // Cerrar popover
                        handlePopoverClose();
                    }
                })
                .catch((error) => {
                    console.error(
                        "Ha ocurrido un error al intentar eliminar el gasto:", error
                    );
                });
        }
    };

    const handleOpenModal = (expense) => {
        setExpenseToEdit(expense);
        setIsModalOpen(true);
        handlePopoverClose();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setExpenseToEdit(null);
        handlePopoverClose();
    };

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
                setIsFixedExpenseUpdated((prevState) => !prevState);
                // Actualizar MoneyWidget
                setRefreshMoneyWidget((prevState) => !prevState);
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
                className="income-table"
                style={{
                    width: "100%",
                    height: tableSize?.height || "100%",
                    border: "3px solid #a3966a",
                    borderRadius: "10px",
                }}
            >
                <Table size="small">
                    <TableHead className="table-head">
                        <TableRow>
                            <TableCell sx={tableHeadStyle}>Fecha</TableCell>
                            <TableCell sx={tableHeadStyle}>Descripción</TableCell>
                            <TableCell sx={tableHeadStyle}>Cantidad</TableCell>
                            <TableCell sx={tableHeadStyle}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fixedExpenses.map((expense) => (
                            <TableRow
                                key={expense.expenseId}
                                style={{ backgroundColor: "white", cursor: "pointer" }}
                                onClick={(event) => handleRowClick(event, expense)}
                            >
                                <TableCell style={tableCellStyle}>
                                    {expense.expenseDate}
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                    {expense.expenseDescription}
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                    {expense.expenseAmount} €
                                </TableCell>
                                <TableCell style={tableCellStyle}><MenuIcon /></TableCell>
                            </TableRow>
                        ))}
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
                    severity="info"
                />
                {isModalOpen && (
                    <ModalWindowUpdateFixedExpense
                        open={isModalOpen}
                        handleClose={handleCloseModal}
                        title="Editar gasto"
                        expense={expenseToEdit}
                        setIsExpenseUpdated={setIsFixedExpenseUpdated}
                    />
                )}
                <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                    <DialogTitle>Añadir Gasto Fijo</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Cantidad"
                            type="number"
                            fullWidth
                            variant="standard"
                            value={newExpense.expenseAmount}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseAmount: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Descripción"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={newExpense.expenseDescription}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseDescription: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            type="date"
                            fullWidth
                            variant="standard"
                            value={newExpense.expenseDate}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseDate: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Categoría"
                            select
                            fullWidth
                            variant="standard"
                            value={newExpense.expenseCategory}
                            onChange={(e) => setNewExpense({ ...newExpense, expenseCategory: e.target.value })}
                        >
                            <MenuItem value="FIXED">Fixed</MenuItem>
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
            <Box className="incomeResume"
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
                        width: "90%",
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
                    Añadir Gasto Fijo
                </Button>
                <MoneyWidget
                    amount={totalFixedExpenses}
                />
            </Box>
        </>
    );
}

export default FixedExpenseTable;
