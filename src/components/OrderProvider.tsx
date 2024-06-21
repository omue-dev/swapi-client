import React, { createContext, useContext, useEffect, useState } from 'react';
import Papa from 'papaparse';

interface Order {
    id: string;
    BestellNr: string;
    Datum: string;
    Lieferant: string;
    Artikel: string;
    ReferenzNr: string;
    ModellCode: string;
    Modell: string;
    Farbe: string;
    Size: string;
    Liefertermin: string;
    Bestellt: string; 
    Bestellmenge: string;
    Kunde: string;
    Bemerkung: string;
    Verkäufer: string;
}

interface OrderContextProps {
    orders: Order[];
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const filePath = '/Bestellungen.csv'; // Pfad zur CSV-Datei

        fetch(filePath)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse<string[]>(csvText, {
                    header: false,
                    skipEmptyLines: true,
                    encoding: 'UTF-8',
                    complete: (results) => {
                        const parsedOrders = (results.data as string[][]).slice(1) // Entferne die erste Zeile (Header)
                            .map((order, index) => ({
                                id: index.toString(), // Oder eine andere eindeutige ID
                                BestellNr: order[0],
                                Datum: order[1],
                                Lieferant: order[2],
                                Artikel: order[3],
                                ReferenzNr: order[4],
                                ModellCode: order[5],
                                Modell: order[6],
                                Farbe: order[7],
                                Size: order[8], // Column position for 'Größe'
                                Liefertermin: order[9],
                                Bestellt: order[10],
                                Bestellmenge: order[11],
                                Kunde: order[12],
                                Bemerkung: order[13],
                                Verkäufer: order[14]
                            }))
                            .filter((order: Order) => order.Bestellt); // Nur Bestellungen mit einem Wert für "Bestellt" beibehalten
                        console.log('Parsed orders:', parsedOrders); // Debugging line
                        setOrders(parsedOrders);
                    },
                    error: (error: unknown) => {
                        console.error('Error parsing CSV:', error);
                    },
                });
            });
    }, []);

    return (
        <OrderContext.Provider value={{ orders }}>
            {children}
        </OrderContext.Provider>
    );
};
