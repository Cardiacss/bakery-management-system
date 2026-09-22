import {
  IsDateString,
  IsInt,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateDailyProdDto {
  @IsDateString()
  prod_date: string;

  @IsInt()
  @Min(0)
  made: number;

  @IsInt()
  @Min(0)
  sold: number;

  @IsInt()
  @IsPositive()
  idprod: number;
}