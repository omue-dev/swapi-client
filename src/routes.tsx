// src/routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetails from './components/ProductDetails';
import Orders from "./pages/Orders";
import { SupplierProvider } from "./components/SupplierProvider";
import { OrderProvider } from "./components/OrderProvider";

const AppRoutes: React.FC = () => (
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/catalog" element={<Catalog />} />
  <Route 
    path="/orders" 
    element={
      <SupplierProvider>
        <OrderProvider>
          <Orders />
        </OrderProvider>
      </SupplierProvider>
    } 
/>
  <Route path="/product/:id" element={<ProductDetails />} />
</Routes>
);

export default AppRoutes;
