import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Snackbar,
  Box,
  Modal,
  Backdrop,
} from "@mui/material";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";

function AddIncome({ userId, setIsIncomeCreated }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const initialIncomeData = {
    incomeAmount: "",
    incomeDate: new Date(),
    incomeDescription: "",
  };

  const [incomeData, setIncomeData] = useState(initialIncomeData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleChange = (event) => {
    setIncomeData({
      ...incomeData,
      [event.target.name]: event.target.value,
    });
  };

  const createIncome = async (event) => {
    event.preventDefault();
    const userConfirmation = window.confirm(
      "¿Estás seguro de que quieres crear este ingreso?",
    );
    if (!userConfirmation) return;

    const incomeDataToSend = {
      ...incomeData,
      incomeDate: incomeData.incomeDate
        .toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "-"),
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/createIncome/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(incomeDataToSend),
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      console.log("Success:", data);
      setSnackbarOpen(true);
      setIncomeData(initialIncomeData);
      handleCloseModal(); // Cierra la ventana modal después de crear el ingreso
      setIsIncomeCreated((prevState) => !prevState); // Actualiza el estado para informar que se ha creado un ingreso
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <AwesomeButton type="primary" onPress={handleOpenModal}>
        Añadir Ingreso
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
            Añadir Ingreso
          </Typography>
          <Box
            component="form"
            onSubmit={createIncome}
            sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              name="incomeAmount"
              label="Cantidad"
              type="number"
              value={incomeData.incomeAmount}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              value={incomeData.incomeDate.toISOString().substr(0, 10)}
              onChange={(event) => {
                setIncomeData({
                  ...incomeData,
                  incomeDate: new Date(event.target.value),
                });
              }}
              required
            />
            <TextField
              name="incomeDescription"
              label="Descripción"
              value={incomeData.incomeDescription}
              onChange={handleChange}
              required
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}
            >
              <Button variant="contained" color="primary" type="submit">
                Crear Ingreso
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Ingreso creado correctamente"
      />
    </>
  );
}

export default AddIncome;
