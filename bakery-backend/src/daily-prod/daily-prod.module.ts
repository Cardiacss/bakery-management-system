import { Module } from '@nestjs/common';
import { DailyProdController } from './daily-prod.controller';
import { DailyProdService } from './daily-prod.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DailyProdController],
  providers: [DailyProdService],
})
export class DailyProdModule {}
