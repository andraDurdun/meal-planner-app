import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MealPage from "./pages/MealPage";
import AddMealPage from "./pages/AddMealPage";
import { UserContext } from "./context/UserContext";
import EditMealPage from "./pages/EditMealPage";

function App() {
  const { user, setUser } = useContext(UserContext);
  // const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = user.name;

    console.log("in app effect");

    if (token && !name) {
      console.log("in app effect, not empty token");

      const endpointUrl = "http://localhost:8080/meal-planner/api/users/me";

      fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Authentication failed");
          }
          return response.json();
        })
        .then((responseData) => {
          setUser({
            id: responseData.id,
            role: responseData.role,
            name: responseData.name,
            token: token,
          });
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/meals" element={<MealPage />} />
          <Route path="/add-meal" element={<AddMealPage />} />
          <Route path="/edit-meal/:id" element={<EditMealPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
