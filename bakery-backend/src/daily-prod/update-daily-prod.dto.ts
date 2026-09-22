import { PartialType } from '@nestjs/mapped-types';
import { CreateDailyProdDto } from './create-daily-prod.dto';

export class UpdateDailyProdDto extends PartialType(CreateDailyProdDto) {}