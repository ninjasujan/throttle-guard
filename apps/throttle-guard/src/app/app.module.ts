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
          options: {
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
          },
        }),
      },
      config: {
        maxRequests: 10,
        windowMs: 20,
        message: 'Too many requests, please try again later.',
        statusCode: 429,
        ipHeader: 'x-real-ip',
      },
    }),
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
