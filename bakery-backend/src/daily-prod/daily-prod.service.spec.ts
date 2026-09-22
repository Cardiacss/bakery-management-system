import { Test, TestingModule } from '@nestjs/testing';
import { DailyProdService } from './daily-prod.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DailyProdService', () => {
  let service: DailyProdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyProdService,
        {
          provide: PrismaService,
          useValue: { daily_prod: {}, product: {} },
        },
      ],
    }).compile();

    service = module.get<DailyProdService>(DailyProdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
