# QuickBite — Food Delivery Order Management

A full-stack food delivery app with menu browsing, cart management, order placement, and real-time order status tracking.

## Tech Stack

- **Frontend**: React 18 + Vite, React Router, CSS Modules
- **Backend**: Node.js + Express (ESM), UUID, CORS
- **Testing**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Project Structure

```
food-delivery/
├── backend/
│   ├── data/
│   │   └── store.js          # In-memory data store
│   └── src/
│       ├── controllers/      # Business logic
│       ├── middleware/        # Error handling
│       ├── routes/           # API routes
│       ├── tests/            # API tests
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/       # Reusable UI components
        ├── context/          # Cart state management
        ├── pages/            # Route-level pages
        ├── tests/            # Component tests
        └── utils/            # API helpers
```

## Setup & Running Locally

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

### Step 1 — Clone / Download the project

```bash
cd food-delivery
```

### Step 2 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 — Start the backend server

```bash
npm run dev
```

The API will run at `http://localhost:5000`

### Step 4 — Install frontend dependencies (new terminal)

```bash
cd frontend
npm install
```

### Step 5 — Start the frontend dev server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/menu | Get all menu items |
| GET | /api/menu/:id | Get single menu item |
| POST | /api/orders | Place a new order |
| GET | /api/orders | Get all orders |
| GET | /api/orders/:id | Get single order |
| PATCH | /api/orders/:id/status | Update order status |

### Order Payload Example

```json
{
  "customer": {
    "name": "John Doe",
    "address": "123 Main Street",
    "phone": "9876543210"
  },
  "items": [
    { "menuItemId": "1", "quantity": 2 },
    { "menuItemId": "3", "quantity": 1 }
  ]
}
```

## Running Tests

### Backend tests

```bash
cd backend
npm test
```

### Frontend tests

```bash
cd frontend
npm test
```

## Features

- Browse menu with category filters
- Add/remove items from cart with quantity controls
- Checkout form with input validation
- Real-time order status tracking (polls every 5s)
- Simulated status progression: Order Received → Preparing → Out for Delivery → Delivered
- Fully responsive layout

## Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel
```

### Backend (Railway / Render)

Set `PORT` environment variable and deploy the `backend/` directory.
