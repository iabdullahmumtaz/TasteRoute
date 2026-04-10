# TasteRoute

Food delivery platform with restaurant browsing, cart, orders, and real-time tracking — inspired by Uber Eats.

## Features

- Restaurant listings with menus
- Per-restaurant shopping cart
- Order placement with delivery fee
- Real-time order status via WebSockets
- Multi-page UI: home, restaurant, orders, track, auth

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Backend  | TypeScript, Node.js, Express, Mongoose |
| Database | MongoDB, Mongoose       |
| Frontend | TypeScript, React, Vite, React Router |

## Ports

| Service | Port |
|---------|------|
| UI      | 5020 |
| API     | 6020 |

## Quick Start

```bash
cp .env.example .env
cd backend && npm install && npm run seed
cd ../frontend && npm install
```

Terminal 1: `cd backend && npm run dev`  
Terminal 2: `cd frontend && npm run dev`

- **UI:** http://localhost:5020
- **API:** http://localhost:6020

## Project Structure

```
TasteRoute/
├── backend/          # Express API + seed
├── frontend/         # React delivery UI
├── docker-compose.yml
└── .env.example
```

## License

MIT
