# API Rate Limiter for NestJS

## Overview

API Rate Limiter is a robust guard for NestJS applications that efficiently manages and restricts the number of requests a client can make within a specified time window. Leveraging Redis as an in-memory data store, this package ensures high-performance request tracking and rate limiting.

## Key Features

- Seamless integration with NestJS applications
- Redis-based request tracking for optimal performance
- Configurable rate limiting parameters
- Support for Sliding Window algorithm
- Extensible architecture for future algorithm implementations

## Technical Stack

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Redis**: An open-source, in-memory data structure store used as a database, cache, and message broker.

## Installation

```bash
npm install @api-guard/trafix
```

## Configuration

1. Set up environment variables in your `.env` file:

```env
REDIS_URL="redis://localhost:6379"
REDIS_PORT=6379
WINDOW_MS=60000  # Time window in milliseconds
MAX_REQUESTS=100  # Maximum requests allowed in the window
```

2. Import and configure the TrafixModule in your app.module.ts:

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
        maxRequests: configService.get<number>('MAX_REQUESTS'),
        windowMs: configService.get<number>('WINDOW_MS'),
        message: 'Rate limit exceeded',
        statusCode: 429,
        headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
      },
    }),
  ],
})
export class AppModule {}
```

## Usage

Apply the TrafixGuard to your controllers:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { TrafixGuard } from '@api-guard/trafix';

@Controller('api')
export class ApiController {
  @UseGuards(TrafixGuard)
  @Get('data')
  getData() {
    // Your controller logic here
  }
}
```

## Contributing

We appreciate contributions from the community. To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to our coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers directly.

---

API Rate Limiter for NestJS - Efficient, Scalable, and Easy to Integrate
