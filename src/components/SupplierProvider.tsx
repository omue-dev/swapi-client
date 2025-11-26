import React, { createContext, useContext, useEffect, useState } from 'react';
import Papa from 'papaparse';

interface Supplier {
    LieferantNr: string;
    Name: string;
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

export const SupplierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        const filePath = '/Lieferanten-Abfrage.csv'; // Pfad zur CSV-Datei
        fetch(filePath)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse<string[]>(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    encoding: 'ISO-8859-1',
                    complete: (results) => {
                        const parsedSuppliers = (results.data as any).map((row: any) => ({
                            LieferantNr: row.LieferantNr,
                            Name: row.Lieferant
                        }));
                        setSuppliers(parsedSuppliers);
                        //console.log("parsedSuppliers:", parsedSuppliers);
                    },
                    error: (error: unknown) => {
                        console.error('Error parsing CSV:', error);
                    },
                });
            });
    }, []);

    return (
        <SupplierContext.Provider value={{ suppliers }}>
            {children}
        </SupplierContext.Provider>
    );
};
