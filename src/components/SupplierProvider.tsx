// src/components/SupplierProvider.tsx
import React, { createContext, useContext } from 'react';

interface Supplier {
  id: number;
  name: string;
}

interface SupplierContextProps {
  suppliers: Supplier[];
}

const SupplierContext = createContext<SupplierContextProps | undefined>(undefined);

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};

export const SupplierProvider: React.FC<{ suppliers: Supplier[]; children: React.ReactNode }> = ({ suppliers, children }) => {
  return (
    <SupplierContext.Provider value={{ suppliers }}>
      {children}
    </SupplierContext.Provider>
  );
};
