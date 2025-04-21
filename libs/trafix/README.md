# API Rate Limiter

## Project Description

API Rate Limiter is a powerful guard for NestJS that restricts the number of requests a client can make within a specific time window. It utilizes Redis as an in-memory store for efficient and scalable request tracking.

## Tech Stack

- **NestJS**: Backend framework for building efficient, reliable and scalable server-side applications
- **Redis**: High-performance in-memory data store for tracking request counts

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
          options: {
            password: configService.get<string>('REDIS_PASSWORD'),
          },
        }),
      },
      config: {
        maxRequests: 10,
        windowMs: 60000, // 60 seconds
        message: 'Too many requests, please try again later.',
        statusCode: 429,
        ipHeader: 'x-real-ip', // Header to extract IP address
        responseHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
      },
    }),
  ],
})
export class AppModule {}
```

### Configuration Options

- `redis`: Redis connection configuration
  - `url`: Redis server URL
  - `options.password`: Redis server password (if required)
- `config`: Rate limiting configuration
  - `maxRequests`: Maximum number of requests allowed in the time window
  - `windowMs`: Time window in milliseconds
  - `message`: Custom error message for rate limit exceeded (optional)
  - `statusCode`: HTTP status code for rate limit exceeded (optional)
  - `ipHeader`: Custom header to extract client IP address (optional)
  - `responseHeaders`: Custom headers to include in the response (optional)

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

- Implements rate limiting using Redis for efficient and scalable request tracking
- Supports the Sliding Window algorithm for accurate rate limiting
- Customizable configuration options for flexible integration
- Extensible architecture for future algorithm implementations

## Contributing

We welcome contributions to improve API Rate Limiter! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows NestJS best practices and includes relevant tests.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/ninjasujan/throttle-guard/blob/main/libs/trafix/LICENCE) file for details.

---

For more information and detailed documentation, please refer to our [official documentation](https://github.com/ninjasujan/throttle-guard/tree/main/libs/trafix).
