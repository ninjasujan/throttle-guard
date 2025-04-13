import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { TrafixGuard } from '@libs/trafix';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    const MockTrafixGuard = {
      canActivate: jest.fn().mockImplementation(() => true),
    };

    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    })
      .overrideGuard(TrafixGuard)
      .useValue(MockTrafixGuard)
      .compile();
  });

  describe('getData', () => {
    it('should return success status', () => {
      const appController = app.get<AppController>(AppController);
      const result = appController.getData();
      expect(result.status).toEqual('success');
    });
  });
});
