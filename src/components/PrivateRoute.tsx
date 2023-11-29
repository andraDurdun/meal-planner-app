import { Route, Navigate, RouteProps, Outlet } from "react-router-dom";
import React from "react";
import { UserContext, UserProvider } from "../context/UserContext";

type Props = {
  component: React.ReactNode;
};

export default function PrivateRoute({ component }: Props) {
  const isLoggedIn = localStorage.getItem("token");
  console.log("In private route");

  return isLoggedIn ? (
    <UserProvider>{component}</UserProvider>
  ) : (
    <Navigate to="/login" />
  );
}
