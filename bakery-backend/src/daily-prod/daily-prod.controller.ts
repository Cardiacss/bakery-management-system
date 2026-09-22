import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { DailyProdService } from './daily-prod.service.js';
import { CreateDailyProdDto } from './create-daily-prod.dto.js';
import { UpdateDailyProdDto } from './update-daily-prod.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe.js';

@UseGuards(JwtAuthGuard)
@Controller('daily-prod')
export class DailyProdController {
  constructor(private readonly dailyProdService: DailyProdService) {}

  @Get()
  findAll() {
    return this.dailyProdService.findAll();
  }

@Delete(':id')
delete(@Param('id', ParseBigIntPipe) id: bigint) {
  return this.dailyProdService.delete(id);
}

  @Get('summary/:date')
  getSummary(@Param('date', ParseDatePipe) date: string) {
    return this.dailyProdService.getSummary(date);
  }

@Get(':id')
findOne(@Param('id', ParseBigIntPipe) id: bigint) {
  return this.dailyProdService.findOne(id);
}

@Patch(':id')
update(
  @Param('id', ParseBigIntPipe) id: bigint,
  @Body() updateDailyProdDto: UpdateDailyProdDto,
) {
  return this.dailyProdService.update(
    id,
    updateDailyProdDto.prod_date,
    updateDailyProdDto.made,
    updateDailyProdDto.sold,
    updateDailyProdDto.idprod !== undefined
      ? BigInt(updateDailyProdDto.idprod)
      : undefined,
  );
}

  @Post()
  create(@Body() createDailyProdDto: CreateDailyProdDto) {
    return this.dailyProdService.create(
      createDailyProdDto.prod_date,
      createDailyProdDto.made,
      createDailyProdDto.sold,
      BigInt(createDailyProdDto.idprod),
    );
  }
}
