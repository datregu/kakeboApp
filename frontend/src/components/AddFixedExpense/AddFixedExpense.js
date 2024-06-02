import React, { useState } from "react";
import {
  TextField,
  Snackbar,
  MenuItem,
  Box,
  Button,
  Backdrop,
  Typography,
  Modal,
} from "@mui/material";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

function AddFixedExpense({ userId, setIsFixedExpenseCreated }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const initialExpenseData = {
    expenseAmount: "",
    expenseDate: new Date(),
    expenseDescription: "",
    expenseCategory: "",
  };

  const [expenseData, setExpenseData] = useState(initialExpenseData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [{ value: "FIXED", label: "Fijo" }];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChange = (event) => {
    setExpenseData({
      ...expenseData,
      [event.target.name]: event.target.value,
    });
  };

  const createExpense = (event) => {
    event.preventDefault();
    const userConfirmation = window.confirm(
      "¿Estás seguro de que quieres crear este gasto?",
    );
    if (!userConfirmation) return;

    const expenseDataToSend = {
      ...expenseData,
      expenseDate: expenseData.expenseDate
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
      .then((response) => response.json())
      .then((data) => {
        setIsFixedExpenseCreated((prevState) => !prevState);
        setExpenseData(initialExpenseData);
        setSnackbarOpen(true);
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <AwesomeButton type="primary" onPress={handleOpenModal}>
        Añadir Gasto
      </AwesomeButton>
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            border: "none",
            borderRadius: "10px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Añadir Gasto
          </Typography>

          <Box
            component="form"
            onSubmit={createExpense}
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              name="expenseAmount"
              label="Cantidad"
              value={expenseData.expenseAmount}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              value={expenseData.expenseDate.toISOString().substr(0, 10)}
              onChange={(event) => {
                setExpenseData({
                  ...expenseData,
                  expenseDate: new Date(event.target.value),
                });
              }}
              required
            />

            <TextField
              name="expenseDescription"
              label="Descripción"
              value={expenseData.expenseDescription}
              onChange={handleChange}
              required
            />

            <TextField
              value={expenseData.expenseCategory}
              onChange={handleChange}
              name="expenseCategory"
              select
              label="Categoría"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </TextField>

            <Button type="submit" variant="contained" color="primary">
              Aceptar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Se ha añadido un nuevo gasto"
      />
    </>
  );
}

export default AddFixedExpense;
