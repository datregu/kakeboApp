import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

const ModalWindowUpdateIncome = ({
  open,
  handleClose,
  title,
  income,
  setIsIncomeUpdated,
}) => {
  const user_id = 1;

  const [incomeData, setIncomeData] = useState({
    incomeAmount: "",
    incomeDate: "",
    incomeDescription: "",
  });

  useEffect(() => {
    if (income) {
      setIncomeData({
        incomeAmount: income.incomeAmount,
        incomeDate: income.incomeDate,
        incomeDescription: income.incomeDescription,
      });
    }
  }, [income]);

  const handleChange = (event) => {
    setIncomeData({
      ...incomeData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateIncome = () => {
    if (
      !incomeData.incomeAmount ||
      !incomeData.incomeDate ||
      !incomeData.incomeDescription
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(incomeData.incomeAmount)) {
      alert("Income amount must be a number");
      return;
    }

    const incomeDate = new Date(incomeData.incomeDate);
    const formattedDate = incomeDate
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    const incomeDataToSend = {
      incomeId: income.incomeId,
      incomeAmount: incomeData.incomeAmount,
      incomeDate: formattedDate,
      incomeDescription: incomeData.incomeDescription,
      user: {
        userId: user_id,
      },
    };

    fetch(`http://localhost:8080/api/updateIncome/${income.incomeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incomeDataToSend),
    })
      .then((response) => {
        if (response.ok) {
          alert("Income updated successfully");
          return response.text().then((text) => {
            return text ? JSON.parse(text) : {};
          });
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        console.log("Success:", data);
        // Actualizamos la tabla de ingresos
        setIsIncomeUpdated((prevState) => !prevState);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backgroundColor: "rgba(0, 0, 0, 0.2)" },
      }}
    >
      <Fade in={open}>
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
            {title}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <TextField
              name="incomeAmount"
              label="Amount"
              value={incomeData.incomeAmount}
              onChange={handleChange}
            />
            <input
              type="date"
              value={
                incomeData.incomeDate instanceof Date
                  ? incomeData.incomeDate.toISOString().substr(0, 10)
                  : ""
              }
              onChange={(event) => {
                setIncomeData({
                  ...incomeData,
                  incomeDate: new Date(event.target.value),
                });
              }}
            />
            <TextField
              name="incomeDescription"
              label="Description"
              value={incomeData.incomeDescription}
              onChange={handleChange}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              aria-label="Back"
              onClick={handleClose}
            >
              Back
            </Button>
            <Button
              onClick={handleUpdateIncome}
              variant="contained"
              color="primary"
              aria-label="Update"
            >
              Update
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalWindowUpdateIncome;
