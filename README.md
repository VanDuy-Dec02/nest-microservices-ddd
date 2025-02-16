# NestJS Microservices with DDD

A modern microservices architecture built with NestJS, following Domain-Driven Design principles.

## 🏗️ Architecture

```
├── apps
│   ├── api-gateway         # API Gateway service
│   ├── auth-service        # Authentication & Authorization service
│   └── user-service        # User management service
├── libs
│   ├── common             # Shared code, constants, and utilities
│   └── core              # Core business logic and shared infrastructure
```

## 🚀 Features

- **Microservices Architecture**: Scalable and maintainable service structure
- **Domain-Driven Design**: Clear separation of concerns and business logic
- **JWT Authentication**: Secure authentication and authorization
- **Role-Based Access Control**: Granular control over user permissions
- **PostgreSQL Database**: Robust data persistence
- **Docker Support**: Containerized development and deployment
- **Swagger Documentation**: API documentation and testing

## 🛠️ Prerequisites

- Node.js (v16 or later)
- Docker & Docker Compose
- PostgreSQL
- Yarn package manager

## 🏃‍♂️ Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd nest-microservices-ddd
```

2. **Install dependencies**

```bash
yarn install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

4. **Start PostgreSQL and other services**

```bash
docker-compose up -d
```

5. **Build the project**

```bash
yarn build:all
```

6. **Start development servers**

```bash
yarn start:dev
```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:

- http://localhost:3000/docs

## 🔒 Authentication

The application uses JWT tokens for authentication:

1. Register a new user:

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}'
```

2. Login:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "Password123!"
}'
```

## 🗄️ Database Migrations

```bash
# Generate a migration
yarn migration:generate

# Run migrations
yarn migration:run

# Revert migrations
yarn migration:revert
```

## 🧪 Testing

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📦 Available Scripts

- `yarn build:all`: Build all applications
- `yarn start:dev`: Start development servers
- `yarn test`: Run tests
- `yarn lint`: Lint code
- `yarn format`: Format code

## 🛡️ Environment Variables

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRATION=7d

# Database Configuration
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nest_microservices

# Service Configuration
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✍️ Authors

- **Duy Nguyen** - _Initial work_ - [duynguyenhnue](https://github.com/duynguyenhnue)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- The DDD community for architectural insights
