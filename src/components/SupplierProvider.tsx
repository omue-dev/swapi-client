import React, { createContext, useContext, useEffect, useState } from 'react';
import { suppliers as mockSuppliers } from '../utils/suppliers';

interface SupplierContextProps {
    suppliers: { [key: string]: string };
}

const SupplierContext = createContext<SupplierContextProps | undefined>(undefined);

export const useSuppliers = () => {
    const context = useContext(SupplierContext);
    if (!context) {
        throw new Error('useSuppliers must be used within a SupplierProvider');
    }
    return context;
};

export const SupplierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [suppliers, setSuppliers] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Mock die Lieferantendaten
        setSuppliers(mockSuppliers);
        console.log('Loaded suppliers:', mockSuppliers); // Log the suppliers dictionary
    }, []);

    return (
        <SupplierContext.Provider value={{ suppliers }}>
            {children}
        </SupplierContext.Provider>
    );
};
