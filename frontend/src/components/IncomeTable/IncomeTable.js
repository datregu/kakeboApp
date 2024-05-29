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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalWindowUpdateIncome from "../../components/ModalWindowUpdateIncome/ModalWindowUpdateIncome";
import { Box } from "@mui/material";
import MoneyWidget from "../../components/MoneyWidget/MoneyWidget";
import "./IncomeTable.css";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);
  const [monthlyRecord, setMonthlyRecord] = useState(null);
  const rowsPerPage = 5;

  const [newIncome, setNewIncome] = useState({
    incomeAmount: "",
    incomeDate: "",
    incomeDescription: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/totalIncomeByLastMonth/${userId}`)
        .then((response) => response.json())
        .then((data) => setTotalIncomeMonth(data))
        .catch((error) => console.error("Error:", error));
  }, [userId]);

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

  const handleCreateIncome = () => {
    const incomeDataToSend = {
      ...newIncome,
      incomeDate: new Date(newIncome.incomeDate)
          .toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
    };

    fetch(`http://localhost:8080/api/createIncome/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incomeDataToSend),
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la creación del ingreso");
          }
          setIsCreateModalOpen(false);
          setIsIncomeUpdated((prevState) => !prevState);
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
          <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
            <DialogTitle>Añadir Ingreso</DialogTitle>
            <DialogContent>
              <TextField
                  autoFocus
                  margin="dense"
                  label="Cantidad"
                  type="number"
                  fullWidth
                  value={newIncome.incomeAmount}
                  onChange={(e) => setNewIncome({ ...newIncome, incomeAmount: e.target.value })}
              />
              <TextField
                  margin="dense"
                  label="Descripción"
                  type="text"
                  fullWidth
                  value={newIncome.incomeDescription}
                  onChange={(e) => setNewIncome({ ...newIncome, incomeDescription: e.target.value })}
              />
              <TextField
                  margin="dense"
                  type="date"
                  fullWidth
                  value={newIncome.incomeDate}
                  onChange={(e) => setNewIncome({ ...newIncome, incomeDate: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsCreateModalOpen(false)} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleCreateIncome} color="primary">
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
                width: "75%",
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
            Añadir Ingreso
          </Button>
          <MoneyWidget
              amount={totalIncomeMonth}
          />
        </Box>
      </>
  );
}

export default IncomeTable;
