// src/components/OrderProvider.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { OrderProvider, useOrders } from './OrderProvider';
import Papa from 'papaparse';

// Mock für Papa.parse
jest.mock('papaparse', () => ({
  parse: jest.fn(),
}));

// Mock für fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve('BestellNr,Datum,Lieferant,Artikel,ReferenzNr,ModellCode,Modell,Farbe,Size,Liefertermin,Bestellt,Bestellmenge,Kunde,Bemerkung,Verkäufer\n1,2024-01-01,Lieferant1,Artikel1,Ref1,ModellCode1,Modell1,Farbe1,Size1,2024-01-02,Ja,10,Kunde1,Bemerkung1,Verkäufer1'),
  })
) as jest.Mock;

const TestComponent: React.FC = () => {
  const { orders } = useOrders();
  return (
    <div>
      {orders.map((order) => (
        <div key={order.id}>{order.BestellNr}</div>
      ))}
    </div>
  );
};

test('renders OrderProvider component and loads orders', async () => {
  const parseMock = Papa.parse as jest.Mock;
  parseMock.mockImplementation((_, options) => {
    options.complete({
      data: [
        ['BestellNr', 'Datum', 'Lieferant', 'Artikel', 'ReferenzNr', 'ModellCode', 'Modell', 'Farbe', 'Size', 'Liefertermin', 'Bestellt', 'Bestellmenge', 'Kunde', 'Bemerkung', 'Verkäufer'],
        ['1', '2024-01-01', 'Lieferant1', 'Artikel1', 'Ref1', 'ModellCode1', 'Modell1', 'Farbe1', 'Size1', '2024-01-02', 'Ja', '10', 'Kunde1', 'Bemerkung1', 'Verkäufer1']
      ],
    });
  });

  render(
    <OrderProvider>
      <TestComponent />
    </OrderProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
