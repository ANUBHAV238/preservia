# Preservia — Smart Atmosphere-Controlled Onion Storage System

A full-stack production-ready IoT SaaS platform for agricultural post-harvest management.

## Architecture

```
preservia/
├── frontend/              # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── ui/        # Button, Card, Badge, Modal, Input, MetricCard, etc.
│       │   ├── layout/    # WebsiteNavbar, WebsiteFooter, DashboardLayout, Sidebar, Topbar
│       │   └── sections/  # HeroSection, ProblemSection, WebsiteSections
│       ├── pages/
│       │   ├── auth/      # LoginPage, RegisterPage
│       │   ├── website/   # HomePage
│       │   └── dashboard/ # OverviewPage, LiveMonitoringPage, GasControlPage, etc.
│       ├── context/       # AuthContext, SocketContext
│       ├── routes/        # ProtectedRoute, PublicRoute
│       └── lib/           # api.js (axios instance)
│
└── backend/               # Node.js + Express + MongoDB
    ├── config/            # db.js, firebase.js
    ├── controllers/       # authController, siloController, sensorController, etc.
    ├── middleware/        # auth.js, errorHandler.js, validate.js
    ├── models/            # User, Silo, SensorReading, Alert, EventLog, Prediction
    ├── routes/            # index.js (all REST endpoints)
    ├── services/          # simulationEngine.js, predictionService.js
    ├── sockets/           # index.js (Socket.io setup)
    ├── utils/             # logger.js, seed.js
    └── server.js          # Entry point
```

## Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- (Optional) Firebase project for push notifications

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run seed      # Create demo user + silos
npm run dev       # Start with nodemon
```

Backend runs at: http://localhost:5000

Demo credentials after seed:
- Email: `demo@preservia.io`
- Password: `Demo@1234`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Environment Variables (.env)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost/preservia |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | Token expiry | 7d |
| `FIREBASE_ENABLED` | Enable push notifications | false |
| `CORS_ORIGIN` | Frontend URL | http://localhost:5173 |
| `SIMULATION_INTERVAL_MS` | Sensor update frequency | 5000 |
| `PREDICTION_INTERVAL_MS` | AI prediction frequency | 1800000 |

## API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new farmer |
| POST | `/api/auth/login` | — | Login and get JWT |
| POST | `/api/auth/device-token` | JWT | Register FCM device token |
| GET | `/api/auth/me` | JWT | Get current user |

### Silos
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/silos` | JWT | Get all silos |
| POST | `/api/silos` | JWT | Create silo |
| PUT | `/api/silos/:id` | JWT | Update silo |
| DELETE | `/api/silos/:id` | JWT | Delete silo |

### Sensor Data
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/sensor/:siloId` | JWT | Latest reading |
| GET | `/api/sensor/history/:siloId?hours=24` | JWT | Historical data |

### Alerts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/alerts/:siloId` | JWT | Get alerts |
| PATCH | `/api/alerts/:id/acknowledge` | JWT | Acknowledge alert |

### Predictions
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/prediction/:siloId` | JWT | Latest prediction |
| GET | `/api/prediction/history/:siloId` | JWT | Prediction history |

### Manual Control
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/control/:siloId` | JWT | Execute control action |
| GET | `/api/control/:siloId/logs` | JWT | Event log |

**Control actions:** `openVent`, `closeVent`, `activateCO2`, `deactivateCO2`, `activateN2`, `deactivateN2`, `switchMode`, `resetSystem`

## Real-Time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `join_farmer_room` | Client→Server | Join farmer's room |
| `sensor_update` | Server→Client | Live sensor reading |
| `alert_triggered` | Server→Client | Alert notification |
| `prediction_update` | Server→Client | New prediction |
| `control_update` | Server→Client | Actuator state change |

## Simulation Engine

- Runs every 5 seconds per silo
- Realistic brownian motion drift per sensor
- Mean reversion to optimal values
- 3% anomaly injection chance per tick
- Responds to actuator states (vent open, CO₂ active)
- Health score: composite 0–100 from all sensors

## AI Prediction Model

- Runs every 30 minutes
- Inputs: 24h averages for temp, humidity, CO₂, O₂ + storage duration
- Outputs: spoilage risk %, estimated safe days, recommendations
- Triggers high-risk alerts and push notifications at >60% risk

## Production Deployment

```bash
NODE_ENV=production npm start
```

Recommended: Use PM2, Nginx reverse proxy, MongoDB Atlas, and Firebase for full production.

