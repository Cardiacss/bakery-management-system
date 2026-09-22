import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { parseUsableDate } from '../common/date.util.js';

@Injectable()
export class DailyProdService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const records = await this.prisma.daily_prod.findMany({
      include: {
        product: true,
      },
    });

    return records.map((record) => ({
      iddaily: record.iddaily,
      prod_date: record.prod_date,
      made: record.made,
      sold: record.sold,
      unsold: record.made - record.sold,
      product: record.product,
      sales: record.product.price.mul(record.sold),
    }));
  }
  async getSummary(date: string) {
  parseUsableDate(date);
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  const records = await this.prisma.daily_prod.findMany({
    where: {
      prod_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      product: true,
    },
  });

  const products = records.map((record) => ({
    product_name: record.product.product_name,
    made: record.made,
    sold: record.sold,
    unsold: record.made - record.sold,
    sales: record.product.price.mul(record.sold),
  }));

  const totalMade = records.reduce(
    (total, record) => total + record.made,
    0,
  );

  const totalSold = records.reduce(
    (total, record) => total + record.sold,
    0,
  );

  const totalUnsold = totalMade - totalSold;

const totalSales = records.reduce(
  (total, record) =>
    total.plus(record.product.price.mul(record.sold)),
  new Prisma.Decimal(0),
);
  return {
    date,
    total_made: totalMade,
    total_sold: totalSold,
    total_unsold: totalUnsold,
    total_sales: totalSales,
    products,
  };
}
async findOne(id: bigint) {
  const record = await this.prisma.daily_prod.findUnique({
    where: {
      iddaily: id,
    },
    include: {
      product: true,
    },
  });

  if (!record) {
    throw new BadRequestException('Daily production record not found');
  }

  return {
    iddaily: record.iddaily,
    prod_date: record.prod_date,
    made: record.made,
    sold: record.sold,
    unsold: record.made - record.sold,
    product: record.product,
    sales: record.product.price.mul(record.sold),
  };
}
async update(
  id: bigint,
  prod_date?: string,
  made?: number,
  sold?: number,
  idprod?: bigint,
) {
  const existing = await this.prisma.daily_prod.findUnique({
    where: {
      iddaily: id,
    },
  });

  if (!existing) {
    throw new BadRequestException('Daily production record not found');
  }

  const newMade = made ?? existing.made;
  const newSold = sold ?? existing.sold;

  if (newSold > newMade) {
    throw new BadRequestException(
      'Sold quantity cannot be greater than made quantity',
    );
  }

  if (idprod !== undefined) {
    const product = await this.prisma.product.findUnique({
      where: {
        idProd: idprod,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }
  }

  const updated = await this.prisma.daily_prod.update({
    where: {
      iddaily: id,
    },
    data: {
      ...(prod_date !== undefined && {
        prod_date: parseUsableDate(prod_date),
      }),
      ...(made !== undefined && { made }),
      ...(sold !== undefined && { sold }),
      ...(idprod !== undefined && { idprod }),
    },
    include: {
      product: true,
    },
  });

  return {
    iddaily: updated.iddaily,
    prod_date: updated.prod_date,
    made: updated.made,
    sold: updated.sold,
    unsold: updated.made - updated.sold,
    product: updated.product,
    sales: updated.product.price.mul(updated.sold),
  };
}
async delete(id: bigint) {
  const existing = await this.prisma.daily_prod.findUnique({
    where: {
      iddaily: id,
    },
  });

  if (!existing) {
    throw new BadRequestException('Daily production record not found');
  }

  return this.prisma.daily_prod.delete({
    where: {
      iddaily: id,
    },
  });
}
  async create(
  prod_date: string,
  made: number,
  sold: number,
  idprod: bigint,
) {
  const product = await this.prisma.product.findUnique({
    where: {
      idProd: idprod,
    },
  });

  if (!product) {
    throw new BadRequestException('Product not found');
  }

  if (sold > made) {
    throw new BadRequestException(
      'Sold quantity cannot be greater than made quantity',
    );
  }

  const created = await this.prisma.daily_prod.create({
    data: {
      prod_date: parseUsableDate(prod_date),
      made,
      sold,
      idprod,
    },
    include: {
      product: true,
    },
  });

  return {
    iddaily: created.iddaily,
    prod_date: created.prod_date,
    made: created.made,
    sold: created.sold,
    unsold: created.made - created.sold,
    product: created.product,
    sales: created.product.price.mul(created.sold),
  };
}
}
