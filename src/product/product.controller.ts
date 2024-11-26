import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './product.dto';


@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  async createProduct(@Body() body: { name: string; price: number }) {
    return this.productService.createProduct(body.name, body.price);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  async getProduct(@Param('id') id: number) {
    return this.productService.getProduct(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: 'ID of the product to delete' })
  async deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }
}
