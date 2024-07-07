import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

test('renders Breadcrumbs component with root path', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<Breadcrumbs />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
});

test('renders Breadcrumbs component with product path', () => {
  render(
    <MemoryRouter initialEntries={['/product']}>
      <Routes>
        <Route path="/" element={<Breadcrumbs />} />
        <Route path="/product" element={<Breadcrumbs />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
  expect(screen.getByText(/Product Detail/i)).toBeInTheDocument();
});
