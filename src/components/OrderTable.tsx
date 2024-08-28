import React from 'react';
import { DataGrid, GridColDef, GridRowClassNameParams } from '@mui/x-data-grid';
import { useSuppliers } from './SupplierProvider';
import { getSupplierName } from '../utils/getSupplierName';
import { formatDate } from '../utils/dateformat';
import { Order } from '../interfaces/types';

interface OrderTableProps {
    data: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ data }) => {
    const { suppliers } = useSuppliers() || { suppliers: [] }; // Fallback, falls suppliers undefined ist

    const columns: GridColDef[] = [
        { field: 'BestellprotokollNr', headerName: 'BestellNr', width: 130 },
        {
            field: 'Lieferant',
            headerName: 'Lieferant',
            width: 200,
            valueGetter: (params: any) => getSupplierName(params, suppliers)
        },
        { field: 'ModellCode', headerName: 'ArtNr.', width: 130 },
        { field: 'Modell', headerName: 'Name', width: 130 },
        { field: 'Farbe', headerName: 'Farbe', width: 130 },
        { field: 'Size', headerName: 'Size', width: 130 },
        {
            field: 'Liefertermin',
            headerName: 'LT',
            width: 130,
            valueGetter: (params: any) => formatDate(params)
        },
        {
            field: 'Bestellt',
            headerName: 'B-Dat.',
            width: 130,
            valueGetter: (params: any) => formatDate(params)
        },
        { field: 'Bestellmenge', headerName: 'Menge', width: 130, valueGetter: (params: any) => parseFloat(params) },
        { field: 'Kunde', headerName: 'Kunde', width: 130 },
        { field: 'Bemerkung', headerName: 'Bemerkung', width: 130 },
        { field: 'Verkäufer', headerName: 'Verkäufer', width: 130 },
    ];

    const getRowClassName = (params: GridRowClassNameParams) => {
        const today = new Date();
        const deliveryDate = (() => {
            const orderedDate = new Date(params.row.Bestellt);
            orderedDate.setDate(orderedDate.getDate() + 5);
            return new Date(params.row.Liefertermin ? params.row.Liefertermin : orderedDate);
        })();
        return deliveryDate < today ? 'row-red' : '';
    };

    return (
        <div style={{ height: 800, width: '100%', overflowX: 'auto' }}>
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
        </div>
    );
};

export default OrderTable;
