import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

const categories = [
  { value: "CULTURA", label: "Cultura" },
  { value: "OCIO_Y_VICIO", label: "Ocio y Vicio" },
  { value: "EXTRAS", label: "Extras" },
  { value: "SUPERVIVENCIA", label: "Supervivencia" },
];

const ModalWindow = ({
  open,
  handleClose,
  title,
  expense,
  userId,
  setIsExpenseUpdated,
}) => {
  const user_id = 1;

  const [expenseData, setExpenseData] = useState({
    expenseAmount: "",
    expenseDate: "",
    expenseDescription: "",
    expenseCategory: "",
  });

  useEffect(() => {
    if (expense) {
      setExpenseData({
        expenseAmount: expense.expenseAmount,
        expenseDate: expense.expenseDate,
        expenseDescription: expense.expenseDescription,
        expenseCategory: expense.expenseCategory,
      });
    }
  }, [expense]);

  const handleChange = (event) => {
    setExpenseData({
      ...expenseData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateExpense = () => {
    if (
      !expenseData.expenseAmount ||
      !expenseData.expenseDate ||
      !expenseData.expenseDescription ||
      !expenseData.expenseCategory
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (isNaN(expenseData.expenseAmount)) {
      alert("Expense amount must be a number");
      return;
    }

    const expenseDate = new Date(expenseData.expenseDate);
    const formattedDate = expenseDate
      .toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");

    const expenseDataToSend = {
      expenseId: expense.expenseId,
      expenseAmount: expenseData.expenseAmount,
      expenseDate: formattedDate,
      expenseDescription: expenseData.expenseDescription,
      expenseCategory: expenseData.expenseCategory,
      user: {
        userId: user_id,
      },
    };
    console.log(
      "Sending the following data:",
      JSON.stringify(expenseDataToSend),
    );
    fetch(`http://localhost:8080/api/updateExpense/${expense.expenseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenseDataToSend),
    })
      .then((response) => {
        if (response.ok) {
          alert("Gasto actualizado correctamente");
          return response.text().then((text) => {
            return text ? JSON.parse(text) : {};
          });
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .then((data) => {
        console.log("Success:", data);
        // Actualizamos la tabla de gastos
        setIsExpenseUpdated((prevState) => !prevState);
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
              name="expenseAmount"
              label="Cantidad"
              value={expenseData.expenseAmount}
              onChange={handleChange}
            />
            <input
              type="date"
              value={
                expenseData.expenseDate instanceof Date
                  ? expenseData.expenseDate.toISOString().substr(0, 10)
                  : ""
              }
              onChange={(event) => {
                setExpenseData({
                  ...expenseData,
                  expenseDate: new Date(event.target.value),
                });
              }}
            />
            <TextField
              name="expenseDescription"
              label="Descripción"
              value={expenseData.expenseDescription}
              onChange={handleChange}
            />
            <Select
              value={expenseData.expenseCategory}
              onChange={handleChange}
              name="expenseCategory"
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              aria-label="Volver"
              onClick={handleClose}
            >
              Volver
            </Button>
            <Button
              onClick={handleUpdateExpense}
              variant="contained"
              color="primary"
              aria-label="Actualizar"
            >
              Cambiar
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalWindow;
