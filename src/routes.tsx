// src/routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from './components/ProductDetails';

const AppRoutes: React.FC = () => (
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/product/:id" element={<ProductDetails />} />
</Routes>
);

export default AppRoutes;
