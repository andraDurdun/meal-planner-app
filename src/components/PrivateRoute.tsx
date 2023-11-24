import { Route, Navigate, RouteProps, Outlet } from "react-router-dom";
import React from "react";

export default function PrivateRoute() {
  const isLoggedIn = localStorage.getItem("token");

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}
