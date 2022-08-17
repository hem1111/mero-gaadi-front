import React from "react";
import "antd/dist/antd.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home.js";
import { AuthProvider } from "./utils/AuthContext.js";
import Dashboard from "./components/pages/Dashboard.js";
import { ownerRoutes, routes } from "./utils/Routes.js";
import NotFound from "./components/pages/NotFound.js";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route, key) => {
            return <Route key={key} path={route.key} element={<Home />} />;
          })}
          {ownerRoutes.map((route, key) => {
            return <Route key={key} path={route.key} element={<Dashboard />} />;
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
