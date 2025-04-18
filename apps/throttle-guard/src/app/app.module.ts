import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TrafixModule } from '@libs/trafix';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TrafixModule.forRootAsync({
      redis: {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'single',
          url: configService.getOrThrow<string>('REDIS_URL'),
        }),
      },
      config: {
        maxRequests: 10,
        windowMs: 60,
        message: 'Too many requests',
        statusCode: 429,
        headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
      },
    }),
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
