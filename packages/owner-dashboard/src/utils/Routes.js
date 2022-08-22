import React from "react";
import ForgotPassword from "../components/auth-pages/ForgotPassword";
import Login from "../components/auth-pages/Login";
import SignUp from "../components/auth-pages/SignUp";
import { ProfileContent } from "../components/dashboard-pages/Profile";
import { Vehicle } from "../components/dashboard-pages/Vehicle";
import { VehicleDetails } from "../components/dashboard-pages/VehicleDetails";
import { VehicleList } from "../components/dashboard-pages/VehicleList";

export const routes = [
  { key: "/login", page: <Login /> },
  { key: "/sign-up", page: <SignUp /> },
  { key: "/forgot-password", page: <ForgotPassword /> },
];

export const ownerRoutes = [
  { key: "/profile", page: <ProfileContent /> },
  { key: "/vehicles", page: <VehicleList /> },
  { key: "/vehicles/add", page: <Vehicle /> },
  { key: "/vehicles/edit/:id", page: <Vehicle /> },
  { key: "/vehicles/view/:id", page: <VehicleDetails /> },
];
