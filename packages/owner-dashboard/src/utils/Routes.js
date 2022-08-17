import React from "react";
import ForgotPassword from "../components/auth-pages/ForgotPassword";
import Login from "../components/auth-pages/Login";
import SignUp from "../components/auth-pages/SignUp";
import { ProfileContent } from "../components/dashboard-pages/Profile";
// import { ProfileContent } from "../components/dashboard-pages/ProfileContent";

export const routes = [
  { key: "/login", page: <Login /> },
  { key: "/sign-up", page: <SignUp /> },
  { key: "/forgot-password", page: <ForgotPassword /> },
];

export const ownerRoutes = [
  { key: "/profile", page: <ProfileContent /> },
  //   { key: "/vehicles", page: <VehiclesList /> },
  //   { key: "/vehicle/add", page: <VehicleAddForm /> },
  //   { key: "/vehicle/edit/:id", page: <VehicleAddForm /> },
];
