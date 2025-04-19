import { Test, TestingModule } from '@nestjs/testing';
import { TrafixGuard } from './trafix.guard';
import { SlidingWindowService } from '../service';

describe('TrafixGuard', () => {
  let guard: TrafixGuard;
  let slidingWindowService: SlidingWindowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafixGuard,
        {
          provide: SlidingWindowService,
          useValue: {
            checkRateLimitOnRequest: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<TrafixGuard>(TrafixGuard);
    slidingWindowService =
      module.get<SlidingWindowService>(SlidingWindowService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });
});
