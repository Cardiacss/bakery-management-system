import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { parseUsableDate } from '../date.util.js';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException('Validation failed (YYYY-MM-DD date is expected)');
    }

    parseUsableDate(value);
    return value;
  }
}
