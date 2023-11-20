import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MealPage from "./pages/MealPage";
import AddMealPage from "./pages/AddMealPage";

function App() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/meals" element={<MealPage />} />
          <Route path="/add-meal" element={<AddMealPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
