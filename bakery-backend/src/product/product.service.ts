import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany();
  }
async findOne(id: bigint) {
  const product = await this.prisma.product.findUnique({
    where: {
      idProd: id,
    },
  });

  if (!product) {
    throw new NotFoundException('Product not found');
  }

  return product;
}
async update(id: bigint, product_name?: string, price?: number) {
  return this.prisma.product.update({
    where: {
      idProd: id,
    },
    data: {
      ...(product_name !== undefined && { product_name }),
      ...(price !== undefined && { price }),
    },
  });
}
async delete(id: bigint) {
  return this.prisma.product.delete({
    where: {
      idProd: id,
    },
  });
}
  async create(product_name: string, price: number) {
    return this.prisma.product.create({
      data: {
        product_name,
        price,
      },
    });
  }
}
