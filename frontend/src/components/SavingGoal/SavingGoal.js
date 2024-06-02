import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

const SavingGoal = ({ monthlyRecord, onSavingsChange }) => {
  const [desiredSavings, setDesiredSavings] = useState(0);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (monthlyRecord) {
      setDesiredSavings(monthlyRecord.desired_savings);
      setIsInputDisabled(monthlyRecord.desired_savings !== 0);
    } else {
      setDesiredSavings(0);
      setIsInputDisabled(true);
    }
  }, [monthlyRecord, reloadKey]);

  const handleInputChange = (event) => {
    setDesiredSavings(Number(event.target.value));
  };

  const handleButtonClick = () => {
    setIsInputDisabled(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = `http://localhost:8080/api/setDesiredSavings?userId=1&month=6&year=2024&desiredSavings=${desiredSavings}`;
    fetch(url, { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          alert("Se ha establecido un nuevo ahorro objetivo");
        } catch (e) {
          console.error("Fallo al parsear el JSON", e);
          alert(
            "Se ha establecido un nuevo ahorro objetivo, pero la respuesta del servidor no fue como se esperaba.",
          );
        }
        onSavingsChange(desiredSavings);
        setIsInputDisabled(true);
        setReloadKey((prevKey) => prevKey + 1);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Error al guardar el nuevo ahorro deseado: " + error.message);
      });
  };
  return (
    <Paper
      elevation={3}
      sx={{
        marginTop: 2,
        padding: 2,
        borderRadius: "10px",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "fill-available",
      }}
    >
      <Typography variant="h6" sx={{ color: "#1976d2", marginBottom: 2 }}>
        Objetivo de Ahorro
      </Typography>
      {!isInputDisabled && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%",
          }}
        >
          <TextField
            type="number"
            label="Ahorro Deseado"
            value={desiredSavings}
            onChange={handleInputChange}
            disabled={isInputDisabled}
            variant="outlined"
            InputProps={{ inputProps: { min: 0 } }}
            fullWidth
          />
          <Button variant="contained" type="submit">
            Aceptar
          </Button>
        </form>
      )}
      {isInputDisabled && (
        <>
          <Typography variant="h5" sx={{ color: "#388e3c" }}>
            {monthlyRecord
              ? (
                  monthlyRecord.total_income - monthlyRecord.fixed_expenses
                ).toFixed(2)
              : 0}{" "}
            €
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Presupuesto mensual inicial
          </Typography>
          <Typography variant="h5" sx={{ color: "#388e3c" }}>
            {desiredSavings} €
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ahorro deseado
          </Typography>
          <Button
            variant="outlined"
            onClick={handleButtonClick}
            sx={{ marginTop: 2 }}
          >
            Cambiar ahorro objetivo
          </Button>
        </>
      )}
      <Typography variant="h5" sx={{ color: "blue", marginTop: 2 }}>
        {monthlyRecord
          ? (
              monthlyRecord.total_income -
              monthlyRecord.fixed_expenses -
              desiredSavings
            ).toFixed(2)
          : 0}{" "}
        €
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Presupuesto mensual final
      </Typography>
    </Paper>
  );
};

export default SavingGoal;
