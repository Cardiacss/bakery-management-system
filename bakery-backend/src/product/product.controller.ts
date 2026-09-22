import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController  {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(
      createProductDto.product_name,
      createProductDto.price,
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(
      id,
      updateProductDto.product_name,
      updateProductDto.price,
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.productService.delete(id);
  }
} 
