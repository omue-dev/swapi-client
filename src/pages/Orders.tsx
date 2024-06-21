import React from 'react';
import OrderTable from '../components/OrderTable';
import { useOrders } from '../components/OrderProvider';

const Orders: React.FC = () => {
    const { orders } = useOrders();

    return (
        <div>
            <h1>Orders</h1>
            <OrderTable data={orders} />
        </div>
    );
};

export default Orders;
