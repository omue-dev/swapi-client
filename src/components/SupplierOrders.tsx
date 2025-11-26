import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowId } from '@mui/x-data-grid';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useSuppliers } from './SupplierProvider';
import { getSupplierName } from '../utils/getSupplierName';
import { formatDate } from '../utils/dateformat';
import { Order } from '../interfaces/types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface SupplierOrdersProps {
    data: Order[];
    supplier: string;
    overdue: boolean;
}

const SupplierOrders: React.FC<SupplierOrdersProps> = ({ data, supplier, overdue }) => {
    const { suppliers } = useSuppliers() || { suppliers: [] };
    const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
    const [selectOverdueOnly, setSelectOverdueOnly] = useState(false);

    // Funktion, um zurück zu den Orders zu navigieren
    const goBackToOrders = () => {
        console.log("Zurück-Button wurde geklickt");
        window.location.href = "/orders";
    };

    // Filterlogik: Zeige entweder alle Bestellungen oder nur Bestellungen mit abgelaufenem Lieferdatum
    const filteredData = overdue
        ? data.filter(order => {
              const deliveryDate = order.Liefertermin ? new Date(order.Liefertermin) : null;
              return order.Lieferant === supplier && deliveryDate && deliveryDate < new Date();
          })
        : data.filter(order => order.Lieferant === supplier);

    const columns: GridColDef[] = [
        {
            field: 'BestellprotokollNr',
            headerName: 'BestellNr',
            width: 90,
            valueGetter: (params: any) => {
                return params === "0" ? 'offen' : params;
            }
        },
        {
            field: 'Lieferant',
            headerName: 'Lieferant',
            width: 200,
            valueGetter: (params: any) => getSupplierName(params, suppliers),
        },
        { field: 'ModellCode', headerName: 'ArtNr.', width: 80 },
        { field: 'Modell', headerName: 'Name', width: 300 },
        { field: 'Farbe', headerName: 'Farbe', width: 130 },
        { field: 'Größe', headerName: 'Size', width: 130 },
        {
            field: 'Bestellt',
            headerName: 'Bestellt',
            width: 130,
            valueGetter: (params: any) => formatDate(params),
        },
        {
            field: 'Liefertermin',
            headerName: 'LT',
            width: 130,
            valueGetter: (params: any) => formatDate(params),
        },
        { field: 'Bestellmenge', headerName: 'Menge', width: 80, valueGetter: (params: any) => Math.floor(params) },
        { field: 'Kunde', headerName: 'Kunde', width: 130 },
        { field: 'Bemerkung', headerName: 'Bemerkung', width: 130 },
        { field: 'Verkäufer', headerName: 'Verkäufer', width: 130 },
    ];

    const handleSelectOverdue = (checked: boolean) => {
        if (checked) {
            const overdueItems = filteredData
                .filter(order => {
                    const deliveryDate = order.Liefertermin ? new Date(order.Liefertermin) : null;
                    return deliveryDate && deliveryDate < new Date();
                })
                .map(order => order.id);
            setSelectedRows(overdueItems);
        } else {
            setSelectedRows([]); // Leere Auswahl bei Abwahl
        }
    };

    const handleOverdueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setSelectOverdueOnly(checked);
        handleSelectOverdue(checked); // Rufe die Funktion direkt nach dem Setzen auf
    };

    const createPDF = () => {
        const doc = new jsPDF('landscape');

        doc.setFontSize(24);
        doc.text('Bestellte Artikel:', 10, 10);

        const tableColumn = ['BestellNr', 'Lieferant', 'ArtNr.', 'Name', 'Farbe', 'Size', 'Bestellt', 'LT', 'Menge'];
        const tableRows: any[] = [];

        selectedRows.forEach(rowId => {
            const row = filteredData.find(item => item.id === rowId);
            if (row) {
                const rowData = [
                    row.BestellprotokollNr,
                    getSupplierName(row.Lieferant, suppliers),
                    row.ModellCode,
                    row.Modell,
                    row.Farbe,
                    row.Größe,
                    row.Bestellt ? formatDate(new Date(row.Bestellt)) : '',
                    row.Liefertermin ? formatDate(new Date(row.Liefertermin)) : '',
                    Math.floor(Number(row.Bestellmenge)),
                ];
                tableRows.push(rowData);
            }
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`Bestellung-${supplier}.pdf`);
    };

    return (
        <div style={{ height: 600, width: '100%', margin: 0, padding: 0 }}>
            

            <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="contained" onClick={goBackToOrders}>Zurück</Button>
                <Button variant="contained" color="primary" onClick={createPDF} disabled={selectedRows.length === 0} style={{ marginLeft: '10px' }}>
                    PDF erstellen
                </Button>
            </div>

            {/* Checkbox für überfällige Artikel */}
            <FormControlLabel
                control={<Checkbox checked={selectOverdueOnly} onChange={handleOverdueChange} />}
                label="überfällige Artikel markieren"
            />

            <DataGrid
                rows={filteredData}
                columns={columns}
                checkboxSelection
                rowSelectionModel={selectedRows}
                onRowSelectionModelChange={(newSelection: GridRowId[]) => setSelectedRows(newSelection)}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 100, page: 0 },
                    },
                }}
                pageSizeOptions={[100]}
                sx={{ width: '100%', overflowY: 'auto' }}
            />
        </div>
    );
};

export default SupplierOrders;
