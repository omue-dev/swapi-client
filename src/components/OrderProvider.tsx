import React, { createContext, useContext, useEffect, useState } from 'react';
import Papa from 'papaparse';

interface Order {
    id: string;
    BestellNr: string;
    FilialeNr: string;
    Transfer: string;
    Datum: string | null; 
    Art: string;
    Lieferant: string;
    Artikel: string;
    ReferenzNr: string;
    ModellCode: string;
    FarbeCode: string;
    Modell: string;
    Farbe: string;
    Größe: string;
    Liefertermin: string | null;
    Bestellt: string | null;
    Bestellen: string;
    Stornieren: string;
    Geliefert: string;
    Bestellmenge: string;
    Abrufmenge: string;
    Liefermenge: string;
    Etikettenmenge: string;
    Preis: string;
    Netto: string;
    Rabatt1: string;
    Rabatt2: string;
    ReservierteMenge: string;
    Kunde: string;
    ZugesagtBis: string;
    Versand: string;
    Versandadresse: string;
    Bemerkung: string;
    Anmahnen: string;
    AngemahntAm: string;
    Verkäufer: string;
    BestellprotokollNr: string;
    Gedruckt: string;
    Code: string;
    S_Key: string;
    S_Status: string;
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

const parseDateToISO = (dateString: string) => {
    // Regulärer Ausdruck für Datumswerte im Format DD.MM.YYYY (z.B. 31.12.2024)
    const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

    if (datePattern.test(dateString)) {
        const dateParts = dateString.split('.');
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-11
        const year = parseInt(dateParts[2], 10);

        // Erstelle ein Datum und prüfe, ob es gültig ist
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
            return date.toISOString(); // Convert to ISO 8601 format
        }
    }

    // Wenn es kein Datum ist, wird es als ungültig betrachtet
    //console.warn(`Ungültiges Datum: ${dateString}`);
    return null; // Gib null zurück, wenn es kein gültiges Datum ist
};




const isDateWithinLast24Months = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const past24Months = new Date();
    past24Months.setMonth(now.getMonth() - 24);
    return date >= past24Months && date <= now;
};

const isDateOlderThanToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return date < today;
};

const isDateWithinLast10Days = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const past10Days = new Date();
    past10Days.setDate(now.getDate() - 10);
    return date >= past10Days && date <= now;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const filePath = '/Bestellungen.csv'; // Pfad zur CSV-Datei (public/)
        fetch(filePath)
            .then(response => response.text())
            .then(csvText => {
                Papa.parse<string[]>(csvText, {
                    header: false,
                    skipEmptyLines: true,
                    encoding: 'ISO-8859-1',
                    complete: (results) => {
                        const parsedOrders = (results.data as string[][]).slice(1) // Entfernt die erste Zeile (Header)
                            .map((order, index) => {
                                const datum = order[3] ? parseDateToISO(order[3]) ?? '' : '';
                                const liefertermin = order[13] ? parseDateToISO(order[13]) ?? '' : '';
                                const bestellt = order[14] ? parseDateToISO(order[14]) ?? '' : '';

                                return {
                                    id: index.toString(),
                                    BestellNr: order[0],
                                    FilialeNr: order[1],
                                    Transfer: order[2],
                                    Datum: datum,
                                    Art: order[4],
                                    Lieferant: order[5],
                                    Artikel: order[6],
                                    ReferenzNr: order[7],
                                    ModellCode: order[8],
                                    FarbeCode: order[9],
                                    Modell: order[10],
                                    Farbe: order[11],
                                    Größe: order[12],
                                    Liefertermin: liefertermin,
                                    Bestellt: bestellt,
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
                                    S_Status: order[39]
                                };
                            })
                            .filter(order => 
                                order.Bestellt &&
                                isDateWithinLast24Months(order.Bestellt) && 
                                (order.Liefertermin && isDateOlderThanToday(order.Liefertermin)) ||
                                (!order.Liefertermin && isDateWithinLast10Days(order.Bestellt))
                            );
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
