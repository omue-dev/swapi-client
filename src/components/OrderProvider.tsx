import React, { createContext, useContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Order } from '../interfaces/types';

interface OrderContextProps {
    orders: Order[];
    fetchOrders: () => Promise<void>;
}
interface FetchOrdersResult {
    createdAt: string | null;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

// Funktion zum Speichern im localStorage
const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// Funktion zum Abrufen von Daten aus dem localStorage
const getFromLocalStorage = (key: string) => {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    // Beim Laden der Seite Bestellungen aus dem localStorage abrufen
    useEffect(() => {
        const savedOrders = getFromLocalStorage('orders');
        if (savedOrders) {
            setOrders(savedOrders);
        }
    }, []);

    // Funktion zum Abrufen der CSV-Daten von "/api/generate-order.csv"
    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/generate-order.csv');

            if (!response.ok) {
                throw new Error('Fehler beim Abrufen der CSV-Datei');
            }

            const csvText = await response.text();

            // Verarbeite die CSV-Daten mit PapaParse
            Papa.parse<string[]>(csvText, {
                header: false,
                skipEmptyLines: true,
                encoding: 'ISO-8859-1',
                complete: (results) => {
                    const parsedOrders = (results.data as string[][]).slice(1).map((order, index) => ({
                        id: index.toString(),
                        BestellNr: order[0],
                        FilialeNr: order[1],
                        Transfer: order[2],
                        Datum: order[3],
                        Art: order[4],
                        Lieferant: order[5],
                        Artikel: order[6],
                        ReferenzNr: order[7],
                        ModellCode: order[8],
                        FarbeCode: order[9],
                        Modell: order[10],
                        Farbe: order[11],
                        Größe: order[12],
                        Liefertermin: order[13],
                        Bestellt: order[14],
                        Bestellen: order[15],
                        Stornieren: order[16],
                        Geliefert: order[17],
                        Bestellmenge: order[18],
                        Abrufmenge: order[19],
                        Liefermenge: order[20],
                        Etikettenmenge: order[21],
                        Preis: order[22],
                        Netto: order[23],
                        Rabatt1: order[24],
                        Rabatt2: order[25],
                        ReservierteMenge: order[26],
                        Kunde: order[27],
                        ZugesagtBis: order[28],
                        Versand: order[29],
                        Versandadresse: order[30],
                        Bemerkung: order[31],
                        Anmahnen: order[32],
                        AngemahntAm: order[33],
                        Verkäufer: order[34],
                        BestellprotokollNr: order[35],
                        Gedruckt: order[36],
                        Code: order[37],
                        S_Key: order[38],
                        S_Status: order[39],
                    }));

                    // Speichere die Bestelldaten in den Zustand und localStorage
                    setOrders(parsedOrders);
                    saveToLocalStorage('orders', parsedOrders);

                    // Speichere das Erstellungsdatum im localStorage
                    const createdAt = new Date().toLocaleString();
                    saveToLocalStorage('createdAt', createdAt);
                },
                error: (error: unknown) => {
                    console.error('Error parsing CSV:', error);
                },
            });
        } catch (error) {
            console.error('Fehler beim Abrufen der Bestellungen:', error);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, fetchOrders }}>
            {children}
        </OrderContext.Provider>
    );
};
