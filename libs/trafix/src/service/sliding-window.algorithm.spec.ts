import { Test, TestingModule } from '@nestjs/testing';
import { SlidingWindowService } from './sliding-window.algorithm';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../memory-store';

// We recommend installing an extension to run jest tests.

describe('SlidingWindowService', () => {
  let slidingWindowService: SlidingWindowService;
  let configService: ConfigService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlidingWindowService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key) => {
              if (key === 'WINDOW_MS') return '60';
              if (key === 'MAX_REQUESTS') return '5';
              return null;
            }),
          },
        },
        {
          provide: RedisService,
          useValue: {
            executeLuaScript: jest.fn(),
          },
        },
      ],
    }).compile();

    slidingWindowService =
      module.get<SlidingWindowService>(SlidingWindowService);
    configService = module.get<ConfigService>(ConfigService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should allow requests within the limit', async () => {
    jest.spyOn(redisService, 'executeLuaScript').mockResolvedValue(3);
    const result = await slidingWindowService.checkRateLimitOnRequest('user1');
    expect(result).toBe(true);
  });

  it('should block requests exceeding the limit', async () => {
    jest.spyOn(redisService, 'executeLuaScript').mockResolvedValue(5);
    const result = await slidingWindowService.checkRateLimitOnRequest('user1');
    expect(result).toBe(false);
  });

  it('should use correct window size and limit from config', async () => {
    jest.spyOn(redisService, 'executeLuaScript').mockResolvedValue(0);
    await slidingWindowService.checkRateLimitOnRequest('user1');
    expect(configService.get).toHaveBeenCalledWith('WINDOW_MS');
    expect(configService.get).toHaveBeenCalledWith('MAX_REQUESTS');
    expect(redisService.executeLuaScript).toHaveBeenCalledWith(
      expect.any(String),
      ['user1'],
      [expect.any(Number), 60000, 5]
    );
  });
});
