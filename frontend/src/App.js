import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/LogIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
