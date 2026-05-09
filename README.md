# Stockwise API

> **Order management backend for African WhatsApp sellers**
> Bridge between informal WhatsApp selling and structured business management.

![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4-000000?style=flat&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=flat&logo=render&logoColor=white)

---

## Overview

Stockwise is a lightweight order management API built for online sellers in francophone Africa who operate primarily through WhatsApp Business. The product bridges the gap between informal WhatsApp selling and structured business management — without changing how sellers work.

**The core insight:** The problem is not the sale. The problem is tracking what happens after the WhatsApp conversation.

### What Stockwise solves

- Orders getting lost in WhatsApp threads
- Stock managed from memory or spreadsheets
- No real revenue visibility
- No way to identify unreliable customers

---

## Features

| Feature                  | Description                                                                     |
| ------------------------ | ------------------------------------------------------------------------------- |
| **OAuth Authentication** | Google & Facebook OAuth2 — zero passwords stored                                |
| **Customer Management**  | Create clients with name and/or WhatsApp number — order history auto-calculated |
| **Product Catalog**      | Name, photo, price, stock tracking with alert thresholds                        |
| **Order Management**     | Multi-product cart, status transitions, automatic stock logic                   |
| **WhatsApp Summary**     | Auto-generated order recap ready to copy-paste into WhatsApp                    |
| **Dashboard & KPIs**     | Real revenue, conversion rate, top products, critical stock                     |
| **PDF & Excel Reports**  | Filterable exports by date, status, product, customer                           |
| **Monitoring**           | Sentry error tracking + Winston structured logs + UptimeRobot                   |

---

## Tech Stack

**Runtime & Language**

- Node.js 20 LTS + TypeScript 5 (strict mode)

**Framework & Database**

- Express.js — modular monolith architecture
- Prisma ORM + PostgreSQL 15

**Authentication**

- Passport.js — Google OAuth2 + Facebook OAuth2
- JWT access token (15min) + refresh token (7 days, HttpOnly cookie)

**Infrastructure**

- Deployed on Render (Web Service + PostgreSQL)
- Cloudinary — product photo storage
- Sentry — real-time error capture
- Winston — structured JSON logs
- node-cron — keep-alive ping (anti-sleep on Render free tier)

**Exports**

- PDFKit — server-side PDF generation
- ExcelJS — Excel report generation

---

## Architecture

Stockwise follows a **modular monolith** architecture inspired by Domain-Driven Design (DDD). Each module is isolated with its own business logic, tests, and data layer. Modules communicate only through their services — never directly between repositories.

```
src/
├── infrastructure/        # Cross-cutting concerns
│   ├── database/          # Prisma singleton
│   ├── monitoring/        # Sentry + health check
│   ├── logger/            # Winston structured logs
│   ├── cron/              # Keep-alive cron
│   ├── pdf/               # PDFKit service
│   ├── excel/             # ExcelJS service
│   ├── cloudinary/        # Photo storage
│   └── oauth/             # Passport strategies
│
├── modules/               # Business modules
│   ├── auth/              # OAuth + JWT
│   ├── users/             # User profile
│   ├── customers/         # Customer management
│   ├── products/          # Catalog + stock
│   ├── orders/            # Core module — order lifecycle
│   ├── dashboard/         # KPIs + statistics
│   └── reports/           # PDF + Excel exports
│
└── shared/                # Utilities
    ├── middlewares/        # Auth, validation, error handling
    ├── errors/            # Custom error classes
    └── config/            # Zod-validated env
```

Each module follows the same pattern:

```
*.routes.ts       →  HTTP endpoints + Swagger docs
*.controller.ts   →  Request/response handling
*.service.ts      →  Business logic and rules
*.repository.ts   →  Database abstraction (Prisma)
*.dto.ts          →  Input validation (Zod)
domain/           →  Pure business entities and policies
```

---

## API Endpoints

Full interactive documentation available at `/api/docs` (Swagger UI).

### Auth

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/api/v1/auth/google`   | Sign in with Google   |
| GET    | `/api/v1/auth/facebook` | Sign in with Facebook |
| POST   | `/api/v1/auth/refresh`  | Refresh access token  |
| POST   | `/api/v1/auth/logout`   | Logout + revoke token |

### Users

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/v1/users/me` | Get current user profile |
| PATCH  | `/api/v1/users/me` | Update profile           |
| DELETE | `/api/v1/users/me` | Delete account           |

### Customers

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| POST   | `/api/v1/customers`     | Create customer            |
| GET    | `/api/v1/customers`     | List customers (paginated) |
| GET    | `/api/v1/customers/:id` | Get customer by ID         |
| PATCH  | `/api/v1/customers/:id` | Update customer            |
| DELETE | `/api/v1/customers/:id` | Soft delete customer       |

### Products

| Method | Endpoint                     | Description                          |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | `/api/v1/products`           | Create product                       |
| GET    | `/api/v1/products`           | List products with stock (paginated) |
| GET    | `/api/v1/products/:id`       | Get product by ID                    |
| PATCH  | `/api/v1/products/:id`       | Update product                       |
| DELETE | `/api/v1/products/:id`       | Soft delete product                  |
| POST   | `/api/v1/products/:id/photo` | Upload product photo                 |

### Orders

| Method | Endpoint                    | Description                               |
| ------ | --------------------------- | ----------------------------------------- |
| POST   | `/api/v1/orders`            | Create order + auto stock update          |
| GET    | `/api/v1/orders`            | List orders (paginated, filterable)       |
| GET    | `/api/v1/orders/:id`        | Get order by ID                           |
| PATCH  | `/api/v1/orders/:id`        | Update order (PENDING only)               |
| PATCH  | `/api/v1/orders/:id/status` | Transition status (DELIVERED / CANCELLED) |
| DELETE | `/api/v1/orders/:id`        | Delete order (PENDING only)               |

### Dashboard

| Method | Endpoint                                      | Description                                 |
| ------ | --------------------------------------------- | ------------------------------------------- |
| GET    | `/api/v1/dashboard?period=today\|week\|month` | KPIs, revenue, top products, critical stock |

### Reports

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| GET    | `/api/v1/reports/orders/pdf`   | Export orders as PDF   |
| GET    | `/api/v1/reports/orders/excel` | Export orders as Excel |

### Health

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| GET    | `/health` | Server + database status |

---

## Business Logic

### Stock flow

```
Order CREATED (PENDING)   →  stockReserved += qty  |  stockAvailable decreases
Order DELIVERED           →  stockTotal -= qty     |  stockReserved -= qty
Order CANCELLED           →  stockReserved -= qty  |  stockAvailable restored
```

### Revenue calculation

```
Real revenue      =  SUM of DELIVERED orders
Potential revenue =  SUM of PENDING orders
Conversion rate   =  DELIVERED / (DELIVERED + CANCELLED) × 100
```

### Order rules

- A PENDING order can be updated or deleted
- A DELIVERED or CANCELLED order is final — no rollback
- Stock logic executes atomically with order creation/update
- Order number auto-generated: `CMD-YYYY-XXXX`

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Google OAuth2 credentials
- Facebook OAuth2 credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/YajiNONFON/stockwise-api.git
cd stockwise-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your values (see Environment Variables section)

# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/stockwise

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Google OAuth2
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth2
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Cloudinary (photo storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Monitoring
SENTRY_DSN=your_sentry_dsn

# App
FRONTEND_URL=http://localhost:3000
RENDER_EXTERNAL_URL=https://your-api-url.onrender.com
NODE_ENV=development
```

---

## Security

| Measure          | Implementation                                               |
| ---------------- | ------------------------------------------------------------ |
| Authentication   | OAuth 2.0 — no passwords stored                              |
| Authorization    | JWT access token (15min) + refresh token (7 days)            |
| Token revocation | Blacklist in database on logout                              |
| Rate limiting    | 100 requests / 15 min per IP                                 |
| HTTP headers     | Helmet.js                                                    |
| CORS             | Whitelist of allowed origins                                 |
| Input validation | Zod on all DTOs                                              |
| SQL injection    | Prisma prepared statements                                   |
| Data isolation   | `userId` on every entity — users never see each other's data |

---

## Monitoring

| Tool            | Role                                                           |
| --------------- | -------------------------------------------------------------- |
| **Sentry**      | Real-time error capture with stack traces                      |
| **Winston**     | Structured JSON logs (ERROR / WARN / INFO / DEBUG)             |
| **UptimeRobot** | Pings `/health` every 5 minutes — email alert if down          |
| **node-cron**   | Keep-alive ping every 14 minutes (Render free tier anti-sleep) |

---

## Database Schema

```
User ──────────── Customer ──── Order ──── OrderItem
  │                                │              │
  ├── Product ────────────────────────────────────┘
  │
  └── RefreshToken
```

5 tables: `users`, `customers`, `products`, `orders`, `order_items` + `refresh_tokens`

---

## Roadmap V2

- [ ] WhatsApp Business API — automatic low stock alerts
- [ ] Supplier management + PDF purchase orders
- [ ] Multi-user support (manager + cashier roles)
- [ ] Offline tablet mode (SQLite + sync)
- [ ] Mobile Money integration (Wave, MTN, Orange)
- [ ] React Native mobile app

---

## Author

**S.Yaji NONFON** — Backend Developer based in Accra, Ghana
Building tools for francophone African businesses.

[LinkedIn](https://linkedin.com/in/your-profile) · [Fiverr](https://fiverr.com/your-profile) · [ComeUp](https://comeup.com/your-profile)

---

_Built with ❤️ for Stinnva and every WhatsApp seller who deserves better tools._
