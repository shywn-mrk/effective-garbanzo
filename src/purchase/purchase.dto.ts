import { ApiProperty } from '@nestjs/swagger';

export class CreatePurchaseDto {
  @ApiProperty({ description: 'The id of the product', example: 2 })
  productId: number;
  
  @ApiProperty({ description: 'The quantity of the product', example: 4 })
  quantity: number;
}

export class PurchaseResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: { id: 1, name: 'Product 1', price: 25.0 } })
  product: {
    id: number;
    name: string;
    price: number;
  };

  @ApiProperty({ example: 3 })
  quantity: number;

  @ApiProperty({ example: 100.0 })
  priceAtPurchaseTime: number;

  @ApiProperty({ example: '2024-11-26T15:30:00.000Z' })
  purchasedAt: string;

  @ApiProperty({
    example: { id: 1, username: 'shayan', email: 'shayan@example.com' },
  })
  user: {
    id: number;
    username: string;
    email: string;
  };
}
