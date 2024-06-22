import React, { useState, useContext } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Login.css";
import UserContext from "../../components/UserContext/UserContext";

const Login = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { userEmail, userPassword };
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Email o contraseña incorrectos");
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          margin: "100px",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button
              variant="contained"
              sx={{
                marginTop: 2,
                backgroundColor: "#482e1d",
                "&:hover": {
                  backgroundColor: "#614a36",
                },
              }}
              fullWidth
              type="submit"
            >
              Login
            </Button>
            <Typography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
              ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
