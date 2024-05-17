import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Dashboard  from "./pages/Dashboard/Dashboard";

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<App />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default Main;