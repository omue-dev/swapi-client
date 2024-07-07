// src/routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import ProductDetails from './components/ProductDetails';
import Orders from "./pages/Orders";
import { SupplierProvider } from "./components/SupplierProvider";
import { OrderProvider } from "./components/OrderProvider";

const AppRoutes: React.FC = () => (
  <SupplierProvider>
    <OrderProvider>
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </OrderProvider>
</SupplierProvider>
);

export default AppRoutes;
