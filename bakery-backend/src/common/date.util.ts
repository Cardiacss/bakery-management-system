import { BadRequestException } from '@nestjs/common';

export function parseUsableDate(value: string): Date {
  const date = new Date(value);
  const datePart = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (Number.isNaN(date.getTime()) || !datePart) {
    throw new BadRequestException('prod_date must be a valid ISO 8601 date');
  }

  const [, year, month, day] = datePart;
  const expectedDate = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    expectedDate.getUTCFullYear() !== Number(year) ||
    expectedDate.getUTCMonth() !== Number(month) - 1 ||
    expectedDate.getUTCDate() !== Number(day)
  ) {
    throw new BadRequestException('prod_date must be a valid calendar date');
  }

  return date;
}
