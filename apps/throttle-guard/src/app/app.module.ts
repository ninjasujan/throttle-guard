import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TrafixModule } from '@libs/trafix';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TrafixModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.getOrThrow<string>('REDIS_URL'),
      }),
    }),
    TrafixModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
