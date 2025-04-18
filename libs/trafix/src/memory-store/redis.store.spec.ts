// import { Test, TestingModule } from '@nestjs/testing';
// import { RedisService } from './redis.store';
// import { Redis } from 'ioredis';

// jest.mock('ioredis');

// describe('RedisService', () => {
//   let redisService: RedisService;
//   let mockRedisClient: jest.Mocked<Redis>;

//   beforeEach(async () => {
//     mockRedisClient = {
//       eval: jest.fn(),
//       connect: jest.fn(),
//       on: jest.fn(),
//     } as any;

//     (Redis as unknown as jest.Mock).mockImplementation(() => mockRedisClient);

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         RedisService,
//         {
//           provide: 'REDIS_CLIENT',
//           useFactory: () => new Redis(),
//         },
//       ],
//     }).compile();

//     redisService = module.get<RedisService>(RedisService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should connect to Redis successfully', () => {
//     expect(mockRedisClient.connect).toHaveBeenCalled();
//     expect(mockRedisClient.on).toHaveBeenCalledWith(
//       'connect',
//       expect.any(Function)
//     );
//     expect(mockRedisClient.on).toHaveBeenCalledWith(
//       'error',
//       expect.any(Function)
//     );
//   });

//   describe('executeLuaScript', () => {
//     it('should execute Lua script successfully', async () => {
//       const script = 'return KEYS[1] .. ARGV[1]';
//       const keys = ['testKey'];
//       const args = ['testArg'];
//       const expectedResult = 'testKeytestArg';

//       mockRedisClient.eval.mockResolvedValue(expectedResult);

//       const result = await redisService.executeLuaScript(script, keys, args);

//       expect(result).toBe(expectedResult);
//       expect(mockRedisClient.eval).toHaveBeenCalledWith(
//         script,
//         keys.length,
//         ...keys,
//         ...args
//       );
//     });

//     it('should throw an error when Lua script execution fails', async () => {
//       const script = 'invalid script';
//       const keys = ['testKey'];
//       const args = ['testArg'];
//       const error = new Error('Script execution failed');

//       mockRedisClient.eval.mockRejectedValue(error);

//       await expect(
//         redisService.executeLuaScript(script, keys, args)
//       ).rejects.toThrow('Script execution failed');
//     });
//   });
// });
