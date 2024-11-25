import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product', example: 'Product A' })
  name: string;

  @ApiProperty({ description: 'The price of the product', example: 100 })
  price: number;
}
