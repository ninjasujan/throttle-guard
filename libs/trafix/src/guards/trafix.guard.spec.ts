import { Test, TestingModule } from '@nestjs/testing';
import { TrafixGuard } from './trafix.guard';
import { SlidingWindowService } from '../service';
import { ConfigExtractor } from '../service';
import { ExecutionContext, HttpException } from '@nestjs/common';

describe('TrafixGuard', () => {
  let guard: TrafixGuard;
  let slidingWindowService: SlidingWindowService;
  let configExtractor: ConfigExtractor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafixGuard,
        {
          provide: SlidingWindowService,
          useValue: {
            validateAPIRequest: jest.fn(),
          },
        },
        {
          provide: ConfigExtractor,
          useValue: {
            getConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<TrafixGuard>(TrafixGuard);
    slidingWindowService =
      module.get<SlidingWindowService>(SlidingWindowService);
    configExtractor = module.get<ConfigExtractor>(ConfigExtractor);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow request when rate limit is not exceeded', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-forwarded-for': '127.0.0.1' },
          connection: { remoteAddress: '127.0.0.1' },
        }),
        getResponse: () => ({
          header: jest.fn(),
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(configExtractor, 'getConfig').mockReturnValue({
      ipHeader: 'x-forwarded-for',
      message: 'Rate limit exceeded',
      statusCode: 429,
    });

    jest.spyOn(slidingWindowService, 'validateAPIRequest').mockResolvedValue({
      isAllowed: true,
      remainingRequests: 5,
    });

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should throw HttpException when rate limit is exceeded', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-forwarded-for': '127.0.0.1' },
          connection: { remoteAddress: '127.0.0.1' },
        }),
        getResponse: () => ({
          header: jest.fn(),
        }),
      }),
    } as ExecutionContext;

    jest.spyOn(configExtractor, 'getConfig').mockReturnValue({
      ipHeader: 'x-forwarded-for',
      message: 'Rate limit exceeded',
      statusCode: 429,
    });

    jest.spyOn(slidingWindowService, 'validateAPIRequest').mockResolvedValue({
      isAllowed: false,
      remainingRequests: 0,
    });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(HttpException);
  });
});
