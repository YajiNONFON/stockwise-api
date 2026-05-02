stockwise-api/
│
├── prisma/
│ ├── schema.prisma
│ └── seed.ts
│
├── docker/
│ ├── Dockerfile
│ └── docker-compose.yml
│
├── docs/
│ ├── swagger.ts
│ └── openapi.yaml
│
├── src/
│ │
│ ├── infrastructure/
│ │ ├── database/
│ │ │ └── prisma.ts
│ │ │
│ │ ├── monitoring/
│ │ │ ├── sentry.ts
│ │ │ └── health.ts
│ │ │
│ │ ├── oauth/
│ │ │ ├── google.strategy.ts
│ │ │ └── facebook.strategy.ts
│ │ │
│ │ ├── pdf/
│ │ │ ├── pdf.service.ts
│ │ │ └── templates/
│ │ │ └── order-report.template.ts
│ │ │
│ │ ├── excel/
│ │ │ ├── excel.service.ts
│ │ │ └── templates/
│ │ │ └── orders-export.template.ts
│ │ │
│ │ ├── storage/
│ │ │ ├── storage.service.ts
│ │ │ └── local.storage.ts
│ │ │
│ │ ├── cron/
│ │ │ └── health.cron.ts
│ │ │
│ │ └── logger/
│ │ └── logger.ts
│ │
│ ├── modules/
│ │ │
│ │ ├── auth/
│ │ │ ├── auth.routes.ts
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── auth.repository.ts
│ │ │ ├── auth.dto.ts
│ │ │ ├── auth.types.ts
│ │ │ ├── domain/
│ │ │ │ ├── token-generator.ts
│ │ │ │ └── auth-policy.ts
│ │ │ └── **tests**/
│ │ │ ├── auth.service.spec.ts
│ │ │ ├── auth.controller.spec.ts
│ │ │ └── auth.integration.spec.ts
│ │ │
│ │ ├── users/
│ │ │ ├── users.routes.ts
│ │ │ ├── users.controller.ts
│ │ │ ├── users.service.ts
│ │ │ ├── users.repository.ts
│ │ │ ├── users.dto.ts
│ │ │ ├── users.types.ts
│ │ │ ├── domain/
│ │ │ │ └── user.entity.ts
│ │ │ └── **tests**/
│ │ │ ├── users.service.spec.ts
│ │ │ ├── users.controller.spec.ts
│ │ │ └── users.integration.spec.ts
│ │ │
│ │ ├── customers/
│ │ │ ├── customers.routes.ts
│ │ │ ├── customers.controller.ts
│ │ │ ├── customers.service.ts
│ │ │ ├── customers.repository.ts
│ │ │ ├── customers.dto.ts
│ │ │ ├── customers.types.ts
│ │ │ ├── domain/
│ │ │ │ ├── customer.entity.ts
│ │ │ │ └── customer-validator.ts
│ │ │ └── **tests**/
│ │ │ ├── customers.service.spec.ts
│ │ │ ├── customers.controller.spec.ts
│ │ │ └── customers.integration.spec.ts
│ │ │
│ │ ├── products/
│ │ │ ├── products.routes.ts
│ │ │ ├── products.controller.ts
│ │ │ ├── products.service.ts
│ │ │ ├── products.repository.ts
│ │ │ ├── products.dto.ts
│ │ │ ├── products.types.ts
│ │ │ ├── domain/
│ │ │ │ ├── product.entity.ts
│ │ │ │ ├── product-validator.ts
│ │ │ │ └── stock-calculator.ts
│ │ │ └── **tests**/
│ │ │ ├── products.service.spec.ts
│ │ │ ├── products.controller.spec.ts
│ │ │ └── products.integration.spec.ts
│ │ │
│ │ ├── orders/
│ │ │ ├── orders.routes.ts
│ │ │ ├── orders.controller.ts
│ │ │ ├── orders.service.ts
│ │ │ ├── orders.repository.ts
│ │ │ ├── orders.dto.ts
│ │ │ ├── orders.types.ts
│ │ │ ├── domain/
│ │ │ │ ├── order.entity.ts
│ │ │ │ ├── order-status.machine.ts
│ │ │ │ ├── order-calculator.ts
│ │ │ │ └── whatsapp-summary.ts
│ │ │ └── **tests**/
│ │ │ ├── orders.service.spec.ts
│ │ │ ├── orders.controller.spec.ts
│ │ │ └── orders.integration.spec.ts
│ │ │
│ │ ├── dashboard/
│ │ │ ├── dashboard.routes.ts
│ │ │ ├── dashboard.controller.ts
│ │ │ ├── dashboard.service.ts
│ │ │ ├── dashboard.repository.ts
│ │ │ ├── dashboard.dto.ts
│ │ │ ├── dashboard.types.ts
│ │ │ └── **tests**/
│ │ │ ├── dashboard.service.spec.ts
│ │ │ └── dashboard.integration.spec.ts
│ │ │
│ │ └── reports/
│ │ ├── reports.routes.ts
│ │ ├── reports.controller.ts
│ │ ├── reports.service.ts
│ │ ├── reports.repository.ts
│ │ ├── reports.dto.ts
│ │ ├── reports.types.ts
│ │ └── **tests**/
│ │ ├── reports.service.spec.ts
│ │ └── reports.integration.spec.ts
│ │
│ ├── shared/
│ │ ├── middlewares/
│ │ │ ├── auth.middleware.ts
│ │ │ ├── validate.middleware.ts
│ │ │ ├── upload.middleware.ts
│ │ │ ├── rate-limit.middleware.ts
│ │ │ └── error.middleware.ts
│ │ │
│ │ ├── errors/
│ │ │ ├── app-error.ts
│ │ │ ├── http-errors.ts
│ │ │ └── error-codes.ts
│ │ │
│ │ ├── domain/
│ │ │ └── value-objects/
│ │ │ ├── money.vo.ts
│ │ │ └── phone.vo.ts
│ │ │
│ │ ├── config/
│ │ │ └── env.ts
│ │ │
│ │ ├── utils/
│ │ │ ├── date.util.ts
│ │ │ ├── currency.util.ts
│ │ │ └── id-generator.util.ts
│ │ │
│ │ └── types/
│ │ ├── express.d.ts
│ │ └── environment.d.ts
│ │
│ ├── routes.ts
│ ├── app.ts
│ ├── server.ts
│ └── index.ts
│
├── tests/
│ ├── helpers/
│ │ ├── prisma-test-client.ts
│ │ ├── app-test.ts
│ │ ├── auth-test.helper.ts
│ │ ├── db.setup.ts
│ │ └── factories/
│ │ ├── user.factory.ts
│ │ ├── customer.factory.ts
│ │ ├── product.factory.ts
│ │ └── order.factory.ts
│ │
│ ├── mocks/
│ │ ├── pdf.service.mock.ts
│ │ └── oauth.mock.ts
│ │
│ └── e2e/
│ ├── auth.e2e.spec.ts
│ ├── orders.e2e.spec.ts
│ ├── products.e2e.spec.ts
│ └── full-workflow.e2e.spec.ts
│
├── jest.config.ts
├── jest.unit.config.ts
├── jest.integration.config.ts
├── jest.e2e.config.ts
├── tsconfig.json
├── tsconfig.build.json
├── .env
├── .env.test
├── .env.example
├── .gitignore
├── package.json
└── README.md
