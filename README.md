# API Rate Limiter

## 🚀 Project Description

API Rate Limiter is a middleware for NestJS that restricts the number of requests a client can make within a specific time window. It uses Redis as an in-memory store for efficient request tracking.

## 🛠️ Tech Stack

- **NestJS** - Backend framework
- **Redis** - In-memory data store for tracking request counts

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```sh
git clone <your-repository-url>
cd <your-project-folder>
```

### 2️⃣ Checkout Main Branch

```sh
git checkout main
```

### 3️⃣ Install Dependencies

```sh
npm install
```

### 4️⃣ Setup Environment Variables

Create a `.env` file in the root directory and add the following:

```env
REDIS_URL="redis://localhost:6379"
REDIS_PORT=6379
WINDOW_MS=60  # Time window in seconds
MAX_REQUESTS=10  # Maximum requests allowed in the window
```

### 5️⃣ Start the Project

```sh
npm run start:dev
```

## 📖 Project Explanation

This middleware implements **rate limiting** using Redis for efficient request tracking. It currently supports the **Sliding Window algorithm** and will be extended to include more algorithms in the future.

### 📌 Integration with NestJS Middleware

To use this in a NestJS project, import and apply it globally:

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiGuardModule, SlidingWindowLogGuard } from '@lib/api-guard';

@Module({
  imports: [ApiGuardModule.forRootAsync()],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SlidingWindowLogGuard).forRoutes('*');
  }
}
```

## 🛑 Open Source Status

This project is currently in **BETA** and is **not yet open-sourced as a separate package**. We plan to open-source it once all rate-limiting algorithms are supported and additional optimizations are implemented. Stay tuned for updates!

## 🤝 Contribution Guide

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a pull request.

Please ensure your code follows NestJS best practices and includes relevant tests.

---

Happy Coding! 🚀
