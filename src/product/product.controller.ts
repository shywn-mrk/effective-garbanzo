import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ schema: { example: { name: 'Product A', price: 100 } } })
  async createProduct(@Body() body: { name: string; price: number }) {
    return this.productService.createProduct(body.name, body.price);
  }

  @Post(':id/purchase')
  @ApiOperation({ summary: 'Purchase a product' })
  @ApiParam({ name: 'id', description: 'Product ID' })
  async purchaseProduct(@Param('id') id: number) {
    return this.productService.purchaseProduct(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  async getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product to delete' })
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
