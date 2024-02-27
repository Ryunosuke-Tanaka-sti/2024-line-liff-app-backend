import { Test, TestingModule } from '@nestjs/testing';
import { UtilitieDataController } from './utilitie-data.controller';

describe('UtilitieDataController', () => {
  let controller: UtilitieDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilitieDataController],
    }).compile();

    controller = module.get<UtilitieDataController>(UtilitieDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
