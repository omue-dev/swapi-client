import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material'; // Button-Import
import { useSuppliers } from './SupplierProvider';
import { getSupplierName } from '../utils/getSupplierName';
import SupplierOrders from './SupplierOrders'; // Import der neuen Komponente
import { useOrders } from './OrderProvider';  // Um die fetchOrders-Funktion zu holen
import { Order } from '../interfaces/types';

interface OrderTableProps {
    showError: (message: string) => void;  // Prop zum Setzen von Fehlernachrichten
    setCreatedAt: (date: string | null) => void;  // Prop zum Setzen des Erstellungsdatums
}

const OrderTable: React.FC<OrderTableProps> = ({ showError, setCreatedAt }) => {
    const { suppliers } = useSuppliers() || { suppliers: [] }; // Fallback, falls suppliers undefined ist
    const { orders, fetchOrders } = useOrders();  // Verwende fetchOrders, um den Endpunkt zu steuern und die Bestellungen zu laden
    const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null); // Zustand für ausgewählten Lieferanten
    const [overdue, setOverdue] = useState(false); // Zustand für den "overdue"-Button

    // Funktion zum Aktualisieren der Bestellungen
    const handleUpdateClick = async () => {
        try {
            await fetchOrders();  // Fetch-Daten
            const updatedCreatedAt = localStorage.getItem('createdAt');
            if (updatedCreatedAt) {
                setCreatedAt(JSON.parse(updatedCreatedAt));  // Setzt das Datum nach Aktualisierung
            }
        } catch (error) {
            showError('Dieser Vorgang bedarf einer aktiven VPN-Verbindung zu weltenbummler.locale');
            console.error('Fehler beim Abrufen der Bestellungen:', error);
        }
    };

    // Filterlogik: Wenn "overdue" aktiviert ist, zeige nur Lieferanten mit abgelaufenem Liefertermin
    const filteredSuppliers = overdue
        ? orders
              .filter(order => {
                  if (!order.Liefertermin) return false;
                  const deliveryDate = new Date(order.Liefertermin);
                  return deliveryDate < new Date(); // Lieferdatum ist abgelaufen
              })
              .map(order => order.Lieferant)
              .filter((value, index, self) => self.indexOf(value) === index) // Nur einzigartige Hersteller
        : orders
              .map(order => order.Lieferant)
              .filter((value, index, self) => self.indexOf(value) === index); // Alle Lieferanten

    const columns: GridColDef[] = [
        {
            field: 'Lieferant',
            headerName: 'Lieferant',
            width: 200,
            valueGetter: (params: any) => getSupplierName(params, suppliers),
            sortable: true, // Ermöglicht das Sortieren
        }
    ];

    const rows = filteredSuppliers.map((supplier, index) => ({
        id: index,
        Lieferant: supplier,
    }));

    // Wenn ein Lieferant ausgewählt wurde, rendere die SupplierOrders-Komponente
    if (selectedSupplier) {
        return <SupplierOrders data={orders} supplier={selectedSupplier} overdue={overdue} />;
    }

    return (
        <div style={{ height: 600, width: '100%' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* Aktualisieren-Button */}
                <Button variant="contained" color="primary" onClick={handleUpdateClick}>
                    Aktualisieren
                </Button>

                {/* Überfällige-Button */}
                <Button variant="contained" color={overdue ? 'primary' : 'error'} onClick={() => setOverdue(!overdue)}>
                    {overdue ? 'Zeige Alle' : 'Zeige Überfällige'}
                </Button>
            </div>

            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 100, page: 0 },
                    },
                    sorting: {
                        sortModel: [{ field: 'Lieferant', sort: 'asc' }],
                    },
                }}
                pageSizeOptions={[100]}
                sortingOrder={['asc', 'desc']}
                onRowClick={(params) => setSelectedSupplier(params.row.Lieferant)} // Bei Klick auf eine Zeile wird der Lieferant gesetzt
                sx={{
                    '& .MuiDataGrid-row:hover': {
                        cursor: 'pointer',
                    },
                }}
            />
        </div>
    );
};

export default OrderTable;
