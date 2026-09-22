import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    if (!/^\d+$/.test(value) || BigInt(value) < 1n) {
      throw new BadRequestException('Validation failed (positive integer string is expected)');
    }

    return BigInt(value);
  }
}
