# API Rate Limiter

## Project Description

API Rate Limiter is a guard for NestJS that restricts the number of requests a client can make within a specific time window. It uses Redis as an in-memory store for efficient request tracking.

## Tech Stack

- **NestJS**: Backend framework
- **Redis**: In-memory data store for tracking request counts

## Installation

```sh
npm install @api-guard/trafix
```

## Usage

### Configuration

Configure the TrafixModule in your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TrafixModule } from '@api-guard/trafix';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TrafixModule.forRootAsync({
      redis: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'single',
          url: configService.get<string>('REDIS_URL'),
        }),
      },
      config: {
        maxRequests: 10,
        windowMs: 60000, // 60 seconds
        message: 'Too many requests',
        statusCode: 429,
        headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
      },
    }),
  ],
})
export class AppModule {}
```

### Applying the Guard

Use the `TrafixGuard` in your controllers:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { TrafixGuard } from '@api-guard/trafix';

@Controller('app')
export class AppController {
  @UseGuards(TrafixGuard)
  @Get('')
  getData() {
    // Your controller logic here
  }
}
```

## Features

- Implements rate limiting using Redis for efficient request tracking
- Currently supports the Sliding Window algorithm
- Extensible architecture for future algorithm implementations

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows NestJS best practices and includes relevant tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

For more information, please refer to the [official documentation](https://github.com/your-repo-link).
