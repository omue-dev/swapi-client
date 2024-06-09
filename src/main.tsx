import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ManufacturerProvider } from "./context/ManufacturerContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <ManufacturerProvider>
    <App />
    </ManufacturerProvider>
  </React.StrictMode>,
);
