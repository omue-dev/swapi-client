// src/components/OrderTable.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import OrderTable from './OrderTable';
import { SupplierProvider } from './SupplierProvider';
import { OrderProvider } from './OrderProvider';
import { formatDate } from '../utils/dateformat';
import { getSupplierName } from '../utils/getSupplierName';
import fetchMock from 'jest-fetch-mock';

jest.mock('../utils/dateformat', () => ({
  formatDate: jest.fn(),
}));

jest.mock('../utils/getSupplierName', () => ({
  getSupplierName: jest.fn(),
}));

const suppliers = [
  { id: 1, name: 'Supplier A' },
  { id: 2, name: 'Supplier B' },
];

const orders = [
  {
    id: '1',
    BestellNr: '1001',
    Datum: '2024-01-01',
    Lieferant: '1', // Verwenden Sie die Lieferanten-ID für das Mapping
    Artikel: 'Artikel 1',
    ReferenzNr: 'Ref 1',
    ModellCode: 'M1',
    Modell: 'Modell 1',
    Farbe: 'Rot',
    Size: 'M',
    Liefertermin: '2023-12-01',
    Bestellt: '2023-11-01',
    Bestellmenge: '10',
    Kunde: 'Kunde 1',
    Bemerkung: 'Bemerkung 1',
    Verkäufer: 'Verkäufer 1',
  },
];

beforeEach(() => {
  fetchMock.resetMocks();
  (formatDate as jest.Mock).mockImplementation((params) => params.value);
  (getSupplierName as jest.Mock).mockImplementation((params, suppliers) => {
    const supplier = suppliers.find((supplier: { id: number }) => supplier.id.toString() === params.value);
    return supplier ? supplier.name : 'Unknown Supplier';
  });
});

test('renders OrderTable component', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(orders));

  render(
    <OrderProvider>
      <SupplierProvider suppliers={suppliers}>
        <OrderTable data={orders} />
      </SupplierProvider>
    </OrderProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('1001')).toBeInTheDocument();
    expect(screen.getByText('Modell 1')).toBeInTheDocument();
  });
});

test('shows notification for overdue orders', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(orders));

  render(
    <OrderProvider>
      <SupplierProvider suppliers={suppliers}>
        <OrderTable data={orders} />
      </SupplierProvider>
    </OrderProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Modell 1 Rot ist überfällig!')).toBeInTheDocument();
  });
});

test('applies correct row className for overdue orders', async () => {
  fetchMock.mockResponseOnce(JSON.stringify(orders));

  render(
    <OrderProvider>
      <SupplierProvider suppliers={suppliers}>
        <OrderTable data={orders} />
      </SupplierProvider>
    </OrderProvider>
  );

  const row = await waitFor(() => screen.getByRole('row', { name: /1001/i }));
  expect(row).toHaveClass('row-red');
});
