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
import ModalWindowUpdateFixedExpense from "../../components/ModalWindowUpdateFixedExpense/ModalWindowUpdateFixedExpense";

function FixedExpenseTable({
                             fixedExpenses,
                             tableSize,
                             setIsFixedExpenseUpdated,
                             setIsFixedExpenseDeleted,
                           }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
            setIsFixedExpenseDeleted((prevState) => !prevState);
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
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  const handleRowClick = (event, expense) => {
    setAnchorEl(event.currentTarget);
    setExpenseToEdit(expense);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);
  const popoverId = isPopoverOpen ? "simple-popover" : undefined;

  return (
      <TableContainer
          component={Paper}
          className="fixed-expense-table"
          style={{
            width: "100%",
            height: tableSize?.height || "100%",
          }}
      >
        <Table size="small">
          <TableHead className="table-head">
            <TableRow>
              <TableCell
                  sx={{
                    color: "white",
                    fontSize: "0.8rem",
                    backgroundColor: "#a3966a",
                    textAlign: "center",
                  }}
              >
                Fecha
              </TableCell>
              <TableCell
                  sx={{
                    color: "white",
                    fontSize: "0.8rem",
                    backgroundColor: "#a3966a",
                    textAlign: "center",
                  }}
              >
                Descripción
              </TableCell>
              <TableCell
                  sx={{
                    color: "white",
                    fontSize: "0.8rem",
                    backgroundColor: "#a3966a",
                    textAlign: "center",
                  }}
              >
                Cantidad
              </TableCell>
              <TableCell
                  sx={{
                    color: "white",
                    fontSize: "0.8rem",
                    backgroundColor: "#a3966a",
                    textAlign: "center",
                  }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fixedExpenses.map((expense) => (
                <TableRow
                    key={expense.expenseId}
                    style={{ backgroundColor: "white", cursor: "pointer" }}
                    onClick={(event) => handleRowClick(event, expense)}
                >
                  <TableCell
                      style={{
                        fontSize: "0.8rem",
                        textAlign: "center",
                        padding: "4px 0",
                      }}
                  >
                    {expense.expenseDate}
                  </TableCell>
                  <TableCell
                      style={{
                        fontSize: "0.8rem",
                        textAlign: "center",
                        padding: "4px 0",
                      }}
                  >
                    {expense.expenseDescription}
                  </TableCell>
                  <TableCell
                      style={{
                        fontSize: "0.8rem",
                        textAlign: "center",
                        padding: "4px 0",
                      }}
                  >
                    {expense.expenseAmount} €
                  </TableCell>
                  <TableCell
                      style={{
                        fontSize: "0.8rem",
                        textAlign: "center",
                        padding: "4px 0",
                      }}
                  >
                  </TableCell>
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
      </TableContainer>
  );
}

export default FixedExpenseTable;
