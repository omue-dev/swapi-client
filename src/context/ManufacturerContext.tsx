import React, { createContext, useState, ReactNode, useContext } from 'react';

// Definiere den Typ für Manufacturer
type Manufacturer = {
  id: string;
  name: string;
  // füge weitere Felder hinzu, falls nötig
};

// Definiere den Typ für den Context
type ManufacturerContextType = {
  manufacturers: Manufacturer[];
  setManufacturers: React.Dispatch<React.SetStateAction<Manufacturer[]>>;
};

// Initialisiere den Context mit einem leeren Objekt
const ManufacturerContext = createContext<ManufacturerContextType | undefined>(undefined);

// Erstelle einen Provider
const ManufacturerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  return (
    <ManufacturerContext.Provider value={{ manufacturers, setManufacturers }}>
      {children}
    </ManufacturerContext.Provider>
  );
};

// Erstelle einen benutzerdefinierten Hook zum Zugriff auf den Context
const useManufacturers = () => {
  const context = useContext(ManufacturerContext);
  if (context === undefined) {
    throw new Error('useManufacturers must be used within a ManufacturerProvider');
  }
  return context;
};

export { ManufacturerProvider, useManufacturers };
