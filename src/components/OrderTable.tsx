import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { useSuppliers } from './SupplierProvider';
import { getSupplierName } from '../utils/getSupplierName';
import { formatDate } from '../utils/dateformat';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

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

interface OrderTableProps {
    data: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
    const { suppliers } = useSuppliers();
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState('');
    const [notifiedOrders, setNotifiedOrders] = useState<string[]>([]);

    const columns: GridColDef[] = [
        { field: 'BestellNr', headerName: 'BestellNr', width: 130 },
        {
            field: 'Datum',
            headerName: 'Datum',
            width: 130,
            valueGetter: (params: any) => formatDate(params)
        },
        {
            field: 'Lieferant',
            headerName: 'Lieferant',
            width: 200,
            valueGetter: (params: any) => getSupplierName(params, suppliers)
        },
        { field: 'ModellCode', headerName: 'ModellCode', width: 130 },
        { field: 'Modell', headerName: 'Modell', width: 130 },
        { field: 'Farbe', headerName: 'Farbe', width: 130 },
        { field: 'Size', headerName: 'Size', width: 130 },
        {
            field: 'Liefertermin',
            headerName: 'Liefertermin',
            width: 130,
            valueGetter: (params: any) => formatDate(params)
        },
        {
            field: 'Bestellt',
            headerName: 'Bestellt',
            width: 130,
            valueGetter: (params: any) => formatDate(params)
        },
        { field: 'Bestellmenge', headerName: 'Bestellmenge', width: 130 },
        { field: 'Kunde', headerName: 'Kunde', width: 130 },
        { field: 'Bemerkung', headerName: 'Bemerkung', width: 130 },
        { field: 'Verkäufer', headerName: 'Verkäufer', width: 130 },
    ];

    useEffect(() => {
        data.forEach((order) => {
            const today = new Date();
            const deliveryDate = new Date(order.Liefertermin);
            if (deliveryDate < today && !notifiedOrders.includes(order.id)) {
                setNotification(`${order.Modell} ${order.Farbe} ist überfällig!`);
                setOpen(true);
                setNotifiedOrders((prev) => [...prev, order.id]);
            }
        });
    }, [data, notifiedOrders]);

    const getRowClassName = (params: GridRowClassNameParams) => {
        const today = new Date();
        const deliveryDate = new Date(params.row.Liefertermin);
        return deliveryDate < today ? 'row-red' : '';
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={data}
                columns={columns}
                getRowClassName={getRowClassName}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 100, page: 0 },
                    },
                }}
                pageSizeOptions={[100]}
            />
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert 
                    onClose={handleClose} 
                    severity="error" 
                    sx={{ width: '100%', backgroundColor: 'red', color: 'white' }}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            sx={{ p: 0.5 }}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    }
                >
                    {notification}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default OrderTable;
