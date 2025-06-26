# Development Setup

## Prerequisites

- Node.js 18 or higher
- npm

## Quick Start

To run both the API server and frontend development server simultaneously:

```bash
npm install
npm run dev
```

This will start:
- API server on http://localhost:3000
- Frontend development server on http://localhost:5137

## Individual Server Commands

If you need to run servers individually:

```bash
# Start API server only
npm run dev:api

# Start frontend only  
npm run dev:frontend
```

## API Documentation

When the API server is running, Swagger documentation is available at:
http://localhost:3000/api-docs

## Troubleshooting

### "Failed to fetch products" Error

This error occurs when the API server is not running. Make sure to:

1. Install dependencies: `npm install`
2. Start the API server: `npm run dev:api` or `npm run dev`
3. Verify the API is responding: `curl http://localhost:3000/api/products`

### Build Errors

For TypeScript build errors, make sure all dependencies are installed:

```bash
cd api && npm install
cd ../frontend && npm install
```

## Configuration

The frontend automatically detects the API server URL:
- Development: http://localhost:3000 (configured in frontend/public/runtime-config.js)
- Production: Uses runtime configuration or falls back to localhost