import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MealPage from "./pages/MealPage";
import AddMealPage from "./pages/AddMealPage";
import EditMealPage from "./pages/EditMealPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MealPage />} />
          </Route>
          <Route path="/meals" element={<PrivateRoute />}>
            <Route path="/meals" element={<MealPage />} />
          </Route>
          <Route path="/add-meal" element={<PrivateRoute />}>
            <Route path="/add-meal" element={<AddMealPage />} />
          </Route>
          <Route path="/edit-meal/:id" element={<EditMealPage />}>
            <Route path="/edit-meal/:id" element={<EditMealPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
