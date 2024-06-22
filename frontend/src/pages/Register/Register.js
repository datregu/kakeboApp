import React, { useState } from "react";
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return re.test(password);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = "Correo electrónico no es válido";
    }
    if (!validatePassword(password)) {
      newErrors.password =
        "La contraseña debe tener al menos 6 caracteres y contener letras y números";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setOpenSnackbar(true);
    setMessage("Usuario creado, redirigiendo a la pantalla de login...");

    const url = "http://localhost:8080/api/users/createUser";
    const requestBody = {
      userName: username,
      userPassword: password,
      userEmail: email,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error durante el registro:", error);
      setMessage("Error durante el registro. Por favor, inténtelo de nuevo.");
    } finally {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <>
      <Header />
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Registro en KakeboApp
            </Typography>
            <form onSubmit={handleRegister}>
              <TextField
                label="Nombre de usuario"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Correo electrónico"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                label="Contraseña"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  backgroundColor: "#482e1d", // Cambia el color de fondo aquí
                  "&:hover": {
                    backgroundColor: "#482e1d", // Cambia el color de fondo en hover aquí
                  },
                }}
              >
                Registrarse
              </Button>
            </form>
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
            >
              <Alert severity="info" sx={{ width: "100%" }}>
                {message}
              </Alert>
            </Snackbar>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
