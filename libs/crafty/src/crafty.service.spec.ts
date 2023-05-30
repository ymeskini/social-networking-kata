import { Test, TestingModule } from '@nestjs/testing';
import { CraftyService } from './crafty.service';

describe('CraftyService', () => {
  let service: CraftyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CraftyService],
    }).compile();

    service = module.get<CraftyService>(CraftyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
