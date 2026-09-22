import { Module } from '@nestjs/common';
import { DailyProdController } from './daily-prod.controller.js';
import { DailyProdService } from './daily-prod.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [DailyProdController],
  providers: [DailyProdService],
})
export class DailyProdModule {}
