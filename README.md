# SWAPI Client

SWAPI Client is a React application that fetches product data and orders from a
REST API. It provides a simple interface to browse catalog entries and view
orders. The project is built with [Vite](https://vitejs.dev/) and uses the
[@mui/material](https://mui.com/) library to render a modern user interface.

## Cloning the Repository

To try the project locally, clone it with Git:

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
