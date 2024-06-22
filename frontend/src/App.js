import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import UserContext from "./components/UserContext/UserContext";
import Register from "./pages/Register/Register";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/refresh"
              element={<Navigate replace to="/dashboard" />}
            />
            {/* otras rutas aquí */}
          </Routes>
        </Router>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
