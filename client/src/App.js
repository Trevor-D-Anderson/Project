import "./App.css";
import React from "react";
import UserForm from "./components/UserForm";
import PrivateCalculator from "./components/PrivateCalculator";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicCalculator from "./components/PublicCalculator";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <div className="App flex justify-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicCalculator />} />
          <Route path="/create_user" element={<UserForm />} />
          <Route path="/private" element={<PrivateCalculator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
