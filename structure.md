stockwise-api/
│
├── prisma/ # Database layer — Prisma ORM
│ ├── schema.prisma # Active schema (symlink or default)
│ ├── schema.postgresql.prisma # Cloud mode — PostgreSQL schema
│ ├── schema.sqlite.prisma # Local/tablet mode — SQLite schema
│ └── seed.ts # Database seeding script
│
├── docker/ # Containerization
│ ├── Dockerfile # App image definition
│ └── docker-compose.yml # Local dev environment
│
├── docs/ # API Documentation
│ ├── swagger.ts # Swagger UI configuration
│ └── openapi.yaml # OpenAPI 3.0 specification
│
├── src/
│ │
│ ├── infrastructure/ # Technical concerns — external world
│ │ │
│ │ ├── database/ # Database connection management
│ │ │ ├── prisma.cloud.ts # PrismaClient → PostgreSQL
│ │ │ └── prisma.local.ts # PrismaClient → SQLite
│ │ │
│ │ ├── notifications/ # Notification system (mode-aware)
│ │ │ ├── notification.interface.ts # Common contract for all notifiers
│ │ │ ├── cloud/ # Internet-required notifications
│ │ │ │ ├── email.service.ts # Nodemailer — SMTP email sending
│ │ │ │ ├── whatsapp.service.ts # WhatsApp Business API
│ │ │ │ ├── email-templates/ # HTML email templates
│ │ │ │ │ ├── low-stock.template.ts
│ │ │ │ │ └── order-confirmed.template.ts
│ │ │ │ └── whatsapp-templates/ # WhatsApp message templates
│ │ │ │ ├── low-stock.template.ts
│ │ │ │ └── order-confirmed.template.ts
│ │ │ └── local/ # Offline notifications
│ │ │ └── inapp-alert.service.ts # In-app alerts — no internet needed
│ │ │
│ │ ├── pdf/ # PDF generation — PDFKit
│ │ │ ├── pdf.service.ts # Core PDF generation engine
│ │ │ ├── pdf.types.ts # PDF-related TypeScript types
│ │ │ └── templates/ # PDF document templates
│ │ │ ├── purchase-order.template.ts # Supplier purchase order
│ │ │ └── report.template.ts # Stock/sales report
│ │ │
│ │ ├── excel/ # Excel generation — ExcelJS
│ │ │ ├── excel.service.ts # Core Excel generation engine
│ │ │ └── templates/
│ │ │ └── stock-report.template.ts # Stock report spreadsheet
│ │ │
│ │ ├── storage/ # File storage management
│ │ │ ├── storage.service.ts # Storage abstraction interface
│ │ │ └── local.storage.ts # Local disk storage (product photos)
│ │ │
│ │ ├── cron/ # Scheduled background jobs
│ │ │ ├── health.cron.ts # App health check — keep Render awake
│ │ │ └── low-stock-check.cron.ts # Periodic stock threshold checker
│ │ │
│ │ └── logger/ # Application logging — Winston
│ │ └── logger.ts # Logger instance + configuration
│ │
│ ├── modules/ # Business modules — core of the app
│ │ │
│ │ ├── auth/ # Authentication & session management
│ │ │ ├── auth.routes.ts # POST /auth/login, /refresh, /logout
│ │ │ ├── auth.controller.ts # HTTP layer — handles req/res
│ │ │ ├── auth.service.ts # Login, logout, token refresh logic
│ │ │ ├── auth.repository.ts # DB queries — find user by email
│ │ │ ├── auth.dto.ts # LoginDto, RefreshTokenDto (Zod)
│ │ │ ├── auth.types.ts # AuthPayload, TokenPair interfaces
│ │ │ ├── domain/
│ │ │ │ ├── password-hasher.ts # bcrypt hash + compare
│ │ │ │ ├── token-generator.ts # JWT access + refresh token signing
│ │ │ │ └── auth-policy.ts # Rules: token expiry, attempts limit
│ │ │ └── **tests**/
│ │ │ ├── auth.service.spec.ts # Unit — mocked repository
│ │ │ ├── auth.controller.spec.ts # Unit — mocked service
│ │ │ └── auth.integration.spec.ts # Integration — real DB + Prisma
│ │ │
│ │ ├── users/ # User & role management
│ │ │ ├── users.routes.ts # GET/POST/PATCH/DELETE /users
│ │ │ ├── users.controller.ts
│ │ │ ├── users.service.ts # CRUD + role assignment logic
│ │ │ ├── users.repository.ts # DB queries — users table
│ │ │ ├── users.dto.ts # CreateUserDto, UpdateUserDto
│ │ │ ├── users.types.ts # UserRole enum: ADMIN/MANAGER/CASHIER
│ │ │ ├── domain/
│ │ │ │ ├── user.entity.ts # User business entity class
│ │ │ │ └── role-policy.ts # Who can do what per role
│ │ │ └── **tests**/
│ │ │ ├── users.service.spec.ts
│ │ │ ├── users.controller.spec.ts
│ │ │ └── users.integration.spec.ts
│ │ │
│ │ ├── products/ # Product catalog management
│ │ │ ├── products.routes.ts # GET/POST/PATCH/DELETE /products
│ │ │ ├── products.controller.ts
│ │ │ ├── products.service.ts # CRUD + photo upload logic
│ │ │ ├── products.repository.ts # DB queries — products table
│ │ │ ├── products.dto.ts # CreateProductDto, UpdateProductDto
│ │ │ ├── products.types.ts # Product, ProductCategory interfaces
│ │ │ ├── domain/
│ │ │ │ ├── product.entity.ts # Product business entity class
│ │ │ │ ├── product-validator.ts # Business rules — price, name, SKU
│ │ │ │ └── stock-threshold.policy.ts # Low stock alert trigger logic
│ │ │ └── **tests**/
│ │ │ ├── products.service.spec.ts
│ │ │ ├── products.controller.spec.ts
│ │ │ └── products.integration.spec.ts
│ │ │
│ │ ├── stock-movements/ # Stock entries, exits, adjustments
│ │ │ ├── stock-movements.routes.ts # POST /stock-movements
│ │ │ ├── stock-movements.controller.ts
│ │ │ ├── stock-movements.service.ts # Entry/exit logic + stock update
│ │ │ ├── stock-movements.repository.ts
│ │ │ ├── stock-movements.dto.ts # CreateMovementDto
│ │ │ ├── stock-movements.types.ts # MovementType: IN/OUT/ADJUSTMENT
│ │ │ ├── domain/
│ │ │ │ ├── movement.entity.ts # Movement business entity
│ │ │ │ └── movement-validator.ts # Cannot exit more than available stock
│ │ │ └── **tests**/
│ │ │ ├── stock-movements.service.spec.ts
│ │ │ ├── stock-movements.controller.spec.ts
│ │ │ └── stock-movements.integration.spec.ts
│ │ │
│ │ ├── sales/ # Sales recording & revenue tracking
│ │ │ ├── sales.routes.ts # POST /sales, GET /sales
│ │ │ ├── sales.controller.ts
│ │ │ ├── sales.service.ts # Record sale + auto-decrease stock
│ │ │ ├── sales.repository.ts
│ │ │ ├── sales.dto.ts # CreateSaleDto, SaleItemDto
│ │ │ ├── sales.types.ts # Sale, SaleItem, SaleSummary
│ │ │ ├── domain/
│ │ │ │ ├── sale.entity.ts # Sale business entity
│ │ │ │ ├── sale-calculator.ts # Total, discounts, taxes calculation
│ │ │ │ └── sale-number.generator.ts # Unique sale number — VTE-2024-0001
│ │ │ └── **tests**/
│ │ │ ├── sales.service.spec.ts
│ │ │ ├── sales.controller.spec.ts
│ │ │ └── sales.integration.spec.ts
│ │ │
│ │ ├── suppliers/ # Supplier directory management
│ │ │ ├── suppliers.routes.ts # GET/POST/PATCH/DELETE /suppliers
│ │ │ ├── suppliers.controller.ts
│ │ │ ├── suppliers.service.ts # Supplier CRUD
│ │ │ ├── suppliers.repository.ts
│ │ │ ├── suppliers.dto.ts # CreateSupplierDto
│ │ │ ├── suppliers.types.ts # Supplier interface
│ │ │ ├── domain/
│ │ │ │ └── supplier-validator.ts # Phone, email, name validation rules
│ │ │ └── **tests**/
│ │ │ ├── suppliers.service.spec.ts
│ │ │ ├── suppliers.controller.spec.ts
│ │ │ └── suppliers.integration.spec.ts
│ │ │
│ │ ├── purchase-orders/ # Supplier purchase orders (PDF)
│ │ │ ├── purchase-orders.routes.ts # GET/POST /purchase-orders
│ │ │ ├── purchase-orders.controller.ts
│ │ │ ├── purchase-orders.service.ts # Create order + generate PDF
│ │ │ ├── purchase-orders.repository.ts
│ │ │ ├── purchase-orders.dto.ts # CreatePurchaseOrderDto
│ │ │ ├── purchase-orders.types.ts # PurchaseOrder, OrderStatus
│ │ │ ├── domain/
│ │ │ │ ├── purchase-order.entity.ts # Order business entity
│ │ │ │ ├── order-number.generator.ts # CMD-2024-0001 format
│ │ │ │ └── order-state-machine.ts # DRAFT → SENT → RECEIVED
│ │ │ └── **tests**/
│ │ │ ├── purchase-orders.service.spec.ts
│ │ │ ├── purchase-orders.controller.spec.ts
│ │ │ └── purchase-orders.integration.spec.ts
│ │ │
│ │ ├── alerts/ # Stock alert history & management
│ │ │ ├── alerts.routes.ts # GET /alerts — alert history
│ │ │ ├── alerts.controller.ts
│ │ │ ├── alerts.service.ts # Orchestrates cloud vs local notif
│ │ │ ├── alerts.repository.ts # Persists alert history to DB
│ │ │ ├── alerts.dto.ts
│ │ │ ├── alerts.types.ts # AlertType, AlertStatus
│ │ │ ├── domain/
│ │ │ │ └── alert-policy.ts # When + how to trigger an alert
│ │ │ └── **tests**/
│ │ │ ├── alerts.service.spec.ts
│ │ │ └── alerts.integration.spec.ts
│ │ │
│ │ ├── dashboard/ # Business statistics & KPIs
│ │ │ ├── dashboard.routes.ts # GET /dashboard
│ │ │ ├── dashboard.controller.ts
│ │ │ ├── dashboard.service.ts # Aggregates sales, stock, revenue
│ │ │ ├── dashboard.repository.ts # Complex aggregation DB queries
│ │ │ ├── dashboard.dto.ts # DashboardStatsDto
│ │ │ ├── dashboard.types.ts # DailyStats, TopProduct, Revenue
│ │ │ └── **tests**/
│ │ │ ├── dashboard.service.spec.ts
│ │ │ └── dashboard.integration.spec.ts
│ │ │
│ │ └── reports/ # PDF & Excel report generation
│ │ ├── reports.routes.ts # GET /reports/pdf, /reports/excel
│ │ ├── reports.controller.ts
│ │ ├── reports.service.ts # Builds and streams PDF/Excel files
│ │ ├── reports.repository.ts # Fetches data for report generation
│ │ ├── reports.dto.ts # ReportFiltersDto — date range, type
│ │ ├── reports.types.ts # ReportType, ReportPeriod
│ │ └── **tests**/
│ │ ├── reports.service.spec.ts
│ │ └── reports.integration.spec.ts
│ │
│ ├── shared/ # Cross-cutting concerns
│ │ │
│ │ ├── config/
│ │ │ └── env.ts # Zod env validation — fails fast
│ │ │
│ │ ├── domain/
│ │ │ └── value-objects/ # Immutable typed business values
│ │ │ ├── money.vo.ts # Amount + currency (FCFA / GHS)
│ │ │ └── phone.vo.ts # Validated WhatsApp phone number
│ │ │
│ │ ├── errors/
│ │ │ ├── app-error.ts # Base AppError class
│ │ │ ├── http-errors.ts # NotFoundError, UnauthorizedError…
│ │ │ └── error-codes.ts # Enum — PRODUCT_NOT_FOUND, etc.
│ │ │
│ │ ├── middlewares/
│ │ │ ├── auth.middleware.ts # JWT verification + user injection
│ │ │ ├── role.middleware.ts # Role guard — ADMIN / MANAGER / CASHIER
│ │ │ ├── validate.middleware.ts # Generic Zod DTO validation
│ │ │ ├── upload.middleware.ts # Multer — product photo uploads
│ │ │ └── error.middleware.ts # Global Express error handler
│ │ │
│ │ ├── types/
│ │ │ ├── express.d.ts # Augments Request with user + storeId
│ │ │ └── environment.d.ts # Types for process.env variables
│ │ │
│ │ └── utils/
│ │ ├── currency.util.ts # Format amounts — 5000 → "5 000 FCFA"
│ │ ├── date.util.ts # Date helpers using date-fns
│ │ └── id-generator.util.ts # Unique ID generation utility
│ │
│ ├── routes.ts # Central router — registers all modules
│ ├── app.ts # Express app setup + global middlewares
│ ├── server.ts # HTTP server bootstrap
│ └── index.ts # Entry point — starts the server
│
├── tests/ # Global test infrastructure
│ │
│ ├── helpers/ # Shared test utilities
│ │ ├── prisma-test-client.ts # Isolated PrismaClient for tests
│ │ ├── app-test.ts # Express app instance for Supertest
│ │ ├── auth-test.helper.ts # Generates valid JWT for test requests
│ │ ├── db.setup.ts # Truncates all tables before each test
│ │ └── factories/ # Test data generators
│ │ ├── user.factory.ts # Creates fake users with roles
│ │ ├── product.factory.ts # Creates fake products with stock
│ │ ├── sale.factory.ts # Creates fake sales with items
│ │ ├── supplier.factory.ts # Creates fake suppliers
│ │ └── stock-movement.factory.ts # Creates fake stock movements
│ │
│ ├── mocks/ # Service mocks for unit tests
│ │ ├── email.service.mock.ts # Prevents real emails in tests
│ │ ├── whatsapp.service.mock.ts # Prevents real WhatsApp in tests
│ │ └── pdf.service.mock.ts # Prevents real PDF generation in tests
│ │
│ └── e2e/ # Full HTTP flow tests — Supertest
│ ├── auth.e2e.spec.ts # Login, refresh, logout flows
│ ├── products.e2e.spec.ts # Full product CRUD over HTTP
│ ├── sales.e2e.spec.ts # Sale recording + stock update
│ ├── stock-movements.e2e.spec.ts # Entry, exit, adjustment flows
│ └── full-workflow.e2e.spec.ts # Fatima's complete daily workflow
│
├── jest.config.ts # Jest global config — all test suites
├── jest.unit.config.ts # Runs unit tests only — no DB needed
├── jest.integration.config.ts # Runs integration tests — needs test DB
├── jest.e2e.config.ts # Runs e2e tests — full app + DB
├── tsconfig.json # TypeScript compiler config
├── tsconfig.build.json # Build config — excludes test files
├── .env # Local environment variables
├── .env.test # Test environment variables
├── .env.example # Template — no secrets
├── .gitignore
├── package.json
└── README.md
