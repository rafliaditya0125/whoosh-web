# Whoosh Web — Train Ticket Booking Frontend

> ⚠️ **Disclaimer:** This project is **not affiliated with, endorsed by, or connected to PT Kereta Cepat Indonesia China (KCIC) or the official Whoosh high-speed rail service** in any way. The name "Whoosh" and related branding are used solely for educational and portfolio demonstration purposes. This is an independent student/developer project built to practice modern web development techniques.

A full-featured train ticket booking web application built with React + TypeScript, implementing a 3-role system (User, Admin, Manager) with complete booking, payment, and reporting flows.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Role-Based Access](#role-based-access)

---

## Overview

Whoosh Web is a single-page application that replicates the core functionality of a high-speed train ticketing system. It covers the full user journey — from searching schedules and selecting seats, to payment and QR-based check-in — alongside an admin management portal and a manager analytics dashboard.

**Purpose:** Educational & portfolio project. Demonstrates clean architecture, feature-based code organization, and integration with a REST API.

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| Framework | React | ^19 |
| Language | TypeScript | ^6 |
| Build Tool | Vite | ^8 |
| Styling | Tailwind CSS | v4 |
| Routing | React Router | v7 |
| Server State | TanStack Query | v5 |
| Client State | Zustand | v5 |
| Forms | React Hook Form + Zod | v7 + v4 |
| HTTP Client | Axios | v1 |
| Charts | Recharts | v3 |
| Tables | TanStack Table | v8 |
| Icons | Lucide React | latest |
| Notifications | React Hot Toast | v2 |
| Testing | Vitest + Testing Library | v4 |

---

## Architecture

The project follows **Feature-based Structure** (non-layered) with **Clean Architecture** principles.

```
src/
├── features/           # Feature modules (self-contained)
│   ├── auth/
│   ├── schedule/
│   ├── booking/
│   ├── payment/
│   ├── profile/
│   ├── admin/
│   └── manager/
├── shared/
│   ├── components/     # Reusable UI components + Layouts
│   └── lib/            # Axios instance, React Query client
└── types/              # Centralized TypeScript types (from OpenAPI spec)
```

Each feature module is structured as:

```
features/{feature}/
├── services/   # API calls (repository pattern)
├── hooks/      # React Query hooks
├── pages/      # Route-level components
├── components/ # Feature-specific components
└── stores/     # Zustand stores (if needed)
```

**Key principles applied:**
- Repository pattern — all API calls isolated in `services/`
- Dependency injection via hooks
- One file, one responsibility
- SOLID principles
- Lazy-loaded routes for performance

---

## Features

### User (Casual Indonesian UI)
| Feature | Description |
|---|---|
| Authentication | Register & login with email/password. Dynamic button labels based on form state. |
| Schedule Search | Search by departure station, arrival station, and date. Station swap button. |
| Schedule List | Browse available trains with departure/arrival times, duration, and pricing. |
| Class Selection | Choose Economy, Business, or VIP class via dialog. |
| Seat Selection | Visual seat map with real-time availability. 10-minute seat locking to prevent double booking. |
| Passenger Management | Add passengers manually or pick from saved list. |
| Booking Confirmation | Review trip details, passengers, seats, and total price before confirming. |
| Payment | 15-minute countdown timer. Supports QRIS, Bank Transfer, and E-Wallet. |
| My Tickets | Three tabs: Unpaid, Active Tickets, History. |
| Ticket Detail | QR code for check-in, reschedule, and refund actions. |
| Refund | Submit refund request with reason and bank account details. 25% cancellation fee. |
| Profile | View and edit profile. Manage saved passengers. |

### Admin (Formal Indonesian UI)
| Feature | Description |
|---|---|
| User Management | List, search, block/activate accounts, change roles. |
| Station Management | Full CRUD for train stations. |
| Train Management | Full CRUD for trains with seat capacity. |
| Schedule Management | Full CRUD for schedules with per-class pricing. Toggle active/inactive. |
| Booking Management | View all bookings with status and date filters. |
| Refund Management | Approve or reject refund requests with optional notes. |

### Manager (Formal Indonesian UI)
| Feature | Description |
|---|---|
| Dashboard | Revenue summary (today/week/month), tickets sold, occupancy rate, top routes. Bar charts via Recharts. |
| Sales Report | Filterable by date range. Per-route, per-train, per-class breakdown. |
| Export | Download sales report as CSV or XLSX. |
| Transaction Monitor | Real-time payment transaction list with status and search filters. |

---

## Project Structure

```
whoosh-fe/
├── public/
├── src/
│   ├── App.tsx                         # Root router with lazy loading & guards
│   ├── main.tsx                        # App entry point with providers
│   ├── index.css                       # Tailwind v4 + design tokens
│   ├── types/
│   │   └── index.ts                    # All TypeScript types (from OpenAPI spec)
│   ├── shared/
│   │   ├── lib/
│   │   │   ├── axios.ts                # Axios instance + interceptors
│   │   │   └── queryClient.ts         # React Query client config
│   │   └── components/
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Select.jsx
│   │       ├── Modal.jsx
│   │       ├── Card.jsx
│   │       ├── Badge.jsx
│   │       ├── Spinner.jsx
│   │       ├── Table.jsx
│   │       ├── Pagination.jsx
│   │       └── Layout/
│   │           ├── MainLayout.jsx      # User layout (top navbar)
│   │           ├── AdminLayout.jsx     # Admin layout (sidebar)
│   │           └── ManagerLayout.jsx  # Manager layout (sidebar)
│   └── features/
│       ├── auth/
│       │   ├── services/authService.ts
│       │   ├── hooks/useAuth.ts
│       │   ├── stores/authStore.ts     # Zustand + localStorage persistence
│       │   ├── pages/LoginPage.tsx
│       │   ├── pages/RegisterPage.tsx
│       │   └── components/Guards.tsx  # Route guards per role
│       ├── schedule/
│       │   ├── services/{station,schedule}Service.ts
│       │   ├── hooks/useSchedule.ts
│       │   └── pages/{Home,ScheduleList}Page.tsx
│       ├── booking/
│       │   ├── services/{passenger,seat,booking}Service.ts
│       │   ├── hooks/useBooking.ts
│       │   ├── stores/bookingStore.ts  # Cross-page booking state
│       │   └── pages/{Passenger,Seat,BookConfirm}Page.tsx
│       ├── payment/
│       │   ├── services/{payment,ticket}Service.ts
│       │   └── pages/{Payment,MyTickets,OrderDetail}Page.tsx
│       ├── profile/
│       │   ├── services/profileService.ts
│       │   └── pages/ProfilePage.tsx
│       ├── admin/
│       │   ├── services/{adminUser,train,adminStation,adminSchedule,adminRefund}Service.ts
│       │   ├── hooks/useAdmin.ts
│       │   └── pages/{AdminDashboard,ManageUsers,ManageStations,ManageTrains,ManageSchedules,ManageBookings,ManageRefunds}Page.tsx
│       └── manager/
│           ├── services/reportService.ts
│           ├── hooks/useManager.ts
│           └── pages/{ManagerDashboard,SalesReport,Transaction}Page.tsx
├── .env
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd whoosh-fe

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend URL

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `/api` |

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Available Scripts

```bash
npm run dev          # Start development server (HMR)
npm run build        # Production build
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with Vitest UI
npm run test:coverage # Run tests with coverage report
```

---

## API Integration

The app integrates with a REST API following the OpenAPI 2.0.0 specification. Authentication uses JWT Bearer tokens sent via the `Authorization` header, handled automatically by the Axios request interceptor.

### Base URL

Configured via `VITE_API_BASE_URL` environment variable.

### Key Endpoints

| Domain | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| Stations | `GET /stations`, `POST /stations`, `PUT /stations/:id`, `DELETE /stations/:id` |
| Schedules | `GET /schedules`, `GET /schedules/:id`, `POST /schedules`, `PUT /schedules/:id`, `PATCH /schedules/:id/status` |
| Seats | `GET /seats/available`, `POST /seats/lock`, `POST /seats/unlock` |
| Bookings | `POST /bookings`, `GET /bookings/my`, `GET /bookings/:id`, `POST /bookings/:id/cancel`, `POST /bookings/:id/reschedule`, `POST /bookings/:id/refund` |
| Payments | `POST /payments/booking/:bookingId`, `GET /payments/:paymentId` |
| Tickets | `GET /tickets/:id/qr` |
| User | `GET /users/profile`, `PUT /users/profile` |
| Saved Passengers | `GET /saved-passengers`, `POST /saved-passengers`, `DELETE /saved-passengers/:id` |
| Admin | `GET /admin/users`, `PATCH /admin/users/:id/status`, `GET /admin/bookings`, `GET /admin/refunds`, `PUT /admin/refunds/:id` |
| Manager | `GET /manager/dashboard`, `GET /manager/reports/sales`, `GET /manager/reports/export`, `GET /manager/transactions` |

### Error Handling

The Axios response interceptor handles all HTTP errors globally:

- `400` — Validation errors, shows field-level messages via toast
- `401` — Clears auth state and redirects to `/login`
- `403` — Access denied toast
- `404` — Not found toast
- `409` — Conflict toast (e.g., seat already booked)
- `422` — Business logic error toast
- `500` — Server error toast with reference code

---

## Role-Based Access

| Role | Access |
|---|---|
| `user` | `/`, `/schedules`, `/booking/*`, `/payment/*`, `/tickets/*`, `/profile` |
| `admin` | `/admin/*` |
| `manager` | `/manager/*` (also has access to admin dashboard data) |

Route guards are implemented as React Router `<Outlet>`-based components in `src/features/auth/components/Guards.tsx`. Unauthenticated users are redirected to `/login`. Users accessing a route outside their role are redirected to their home route.

---

## Known Limitations

The following backend API gaps have been identified and proposals submitted to the backend team:

| # | Issue | Workaround |
|---|---|---|
| 001 | `GET /schedules` returns station IDs, not names | Fetch all stations once, cache for 10 min, resolve by ID on the frontend |
| 002 | No per-class seat availability in schedule response | Class selection dialog does not show remaining seats per class |
| 003 | `GET /bookings/my` has no pagination | All bookings fetched at once |

---

## License

This project is for **educational and portfolio purposes only**. It is not affiliated with or endorsed by PT Kereta Cepat Indonesia China (KCIC) or the Whoosh high-speed rail brand.
