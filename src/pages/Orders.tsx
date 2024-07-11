import React from 'react';
import OrderTable from '../components/OrderTable';
import { useOrders } from '../components/OrderProvider';

const Orders: React.FC = () => {
    const { orders } = useOrders();

    return (
        <div>
            <h4>Bestellungen mit baldigem Liefertermin und vor kurzem bestellte Artikel</h4>
            <OrderTable data={orders} />
        </div>
    );
};

export default Orders;
