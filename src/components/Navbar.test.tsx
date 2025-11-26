import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

test('renders Navbar component', () => {
  render(
    <MemoryRouter>
      <Navbar isDarkMode={false} toggleDarkMode={() => {}} />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/CATALOG/i);
  expect(linkElement).toBeInTheDocument();
});

test('contains a link to the orders page', () => {
  render(
    <MemoryRouter>
      <Navbar isDarkMode={false} toggleDarkMode={() => {}} />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/ORDERS/i);
  expect(linkElement).toBeInTheDocument();
});
