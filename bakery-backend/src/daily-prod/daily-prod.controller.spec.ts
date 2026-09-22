import { Test, TestingModule } from '@nestjs/testing';
import { DailyProdController } from './daily-prod.controller';
import { DailyProdService } from './daily-prod.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('DailyProdController', () => {
  let controller: DailyProdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailyProdController],
      providers: [
        {
          provide: DailyProdService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DailyProdController>(DailyProdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
