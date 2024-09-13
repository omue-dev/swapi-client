import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';  // MUI-Komponenten importieren
import OrderTable from '../components/OrderTable';

const Orders: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');  // Zustand für Fehlermeldung
    const [open, setOpen] = useState(false);  // Zustand für Snackbar
    const [createdAt, setCreatedAt] = useState<string | null>(null);  // Zustand für das Erstellungsdatum

    // Beim Initialisieren das Datum aus dem localStorage holen
    useEffect(() => {
        const savedCreatedAt = localStorage.getItem('createdAt');
        if (savedCreatedAt) {
            setCreatedAt(JSON.parse(savedCreatedAt));  // Entferne die Anführungszeichen durch JSON.parse
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    // Funktion zum Setzen der Fehlermeldung und Anzeigen der Snackbar
    const showError = (message: string) => {
        setErrorMessage(message);
        setOpen(true);
    };

    return (
        <div>
            {/* Anzeige des Erstellungsdatums */}
            {createdAt && <p>Stand: <b>{createdAt}</b></p>}

            {/* Tabelle mit Bestellungen, Übergibt showError und setCreatedAt an die OrderTable-Komponente */}
            <OrderTable showError={showError} setCreatedAt={setCreatedAt} />

            {/* MUI Snackbar für Fehlermeldung */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Orders;
