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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModalWindowUpdateIncome from "../../components/ModalWindowUpdateIncome/ModalWindowUpdateIncome";

// Definir objetos de estilo reutilizables
const tableCellStyle = {
  fontSize: "0.8rem",
  backgroundColor: "white",
  textAlign: "center",
};

const tableHeadStyle = {
  color: "white",
  fontSize: "1rem",
  backgroundColor: "#a3966a",
  textAlign: "center",
};

function IncomeTable({
                       incomes,
                       userId,
                       tableSize,
                       setIsIncomeDeleted,
                       setIsIncomeUpdated,
                     }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDeleteIncome = (incomeId) => {
    const userConfirmation = window.confirm(
        "¿Estás seguro de que quieres borrar este ingreso?",
    );
    if (userConfirmation) {
      fetch(`http://localhost:8080/api/deleteIncome/${incomeId}`, {
        method: "DELETE",
      })
          .then((response) => {
            if (!response.ok) {
              alert("No se ha podido eliminar el ingreso");
            } else {
              setIsIncomeDeleted((prevState) => !prevState);
              setSnackbarOpen(true);
            }
          })
          .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error,
            );
          });
    }
  };

  const handleOpenModal = (income) => {
    setIncomeToEdit(income);
    setIsModalOpen(true);
    setAnchorEl(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIncomeToEdit(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleRowClick = (event, income) => {
    setAnchorEl(event.currentTarget);
    setIncomeToEdit(income);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
      <TableContainer
          component={Paper}
          className="income-table"
          style={{
            width: "100%",
            height: tableSize?.height || "100%",
          }}
      >
        <Table size="small">
          <TableHead className="table-head">
            <TableRow>
              <TableCell sx={tableHeadStyle}>Fecha</TableCell>
              <TableCell sx={tableHeadStyle}>Cantidad</TableCell>
              <TableCell sx={tableHeadStyle}>Descripción</TableCell>
              <TableCell sx={{ ...tableHeadStyle, verticalAlign: "center" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes
                .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                .map((income) => (
                    <TableRow
                        key={income.incomeId}
                        style={{ backgroundColor: "#A2CD32", cursor: "pointer" }}
                        onClick={(event) => handleRowClick(event, income)}
                    >
                      <TableCell
                          component="th"
                          scope="row"
                          style={tableCellStyle}
                      >
                        {income.incomeDate}
                      </TableCell>
                      <TableCell
                          align="right"
                          style={tableCellStyle}
                      >
                        {income.incomeAmount}
                      </TableCell>
                      <TableCell
                          align="right"
                          style={tableCellStyle}
                      >
                        {income.incomeDescription}
                      </TableCell>
                      <TableCell
                          align="right"
                          style={tableCellStyle}
                      ></TableCell>
                    </TableRow>
                ))}
          </TableBody>
        </Table>
        <Popover
            id={id}
            open={open}
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
            <IconButton onClick={() => handleOpenModal(incomeToEdit)}>
              <EditOutlinedIcon style={{ color: "black" }} />
            </IconButton>
            <IconButton onClick={() => handleDeleteIncome(incomeToEdit.incomeId)}>
              <DeleteOutlineOutlinedIcon style={{ color: "black" }} />
            </IconButton>
          </div>
        </Popover>
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
