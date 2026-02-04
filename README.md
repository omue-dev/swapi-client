# SWAPI Client

A React-based product management application for browsing, filtering, and editing product catalog entries. It provides a control center dashboard for product curation with a modern, responsive UI.

## Features

- Server-side pagination, sorting, and filtering
- Debounced search with manufacturer filtering
- Product metadata editing (meta title, description, keywords)
- Related products management with content adoption
- Dark/light theme toggle
- Responsive layout with collapsible sidebar

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and builds
- **Material-UI** (MUI) with Data Grid for tables
- **Axios** for API communication
- **SCSS** for styling
- **Jest** + Testing Library for tests

## Project Structure

```
src/
├── components/       # UI components (ProductTable, ProductDetails, Navbar, etc.)
│   └── common/       # Reusable components (MetaDataFields, RelatedProducts)
├── pages/            # Page components (Home, Catalog)
├── hooks/            # Custom hooks for data fetching & mutations
├── utils/            # Axios instance, date formatting, helpers
├── interfaces/       # TypeScript types
├── styles/           # SCSS files (variables, mixins, globals)
├── App.tsx           # Root component with theme & routing
├── routes.tsx        # Route definitions
└── theme.ts          # MUI light/dark theme config
```

## Cloning the Repository

```bash
git clone https://github.com/omue-dev/swapi-client.git
cd swapi-client
```

## Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_KEY` | API key for authenticating mutation requests (must match backend `API_KEY`) |

The API key is required for product updates. It must match the `API_KEY` configured in the backend server.

The Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Build

Create an optimized production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## Testing

Run the unit tests with Jest:

```bash
npm test
```

## Linting

Check code quality with ESLint:

```bash
npm run lint
```
