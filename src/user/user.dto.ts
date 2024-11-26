import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'user1', description: 'Username of the new user' })
  username: string;

  @ApiProperty({ example: 'pass123', description: 'Password for the new user' })
  password: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'user1', description: 'Username of the user' })
  username: string;

  @ApiProperty({ example: 'pass123', description: 'Password of the user' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  accessToken: string;
}

export class UserPurchasesItemDto {
  @ApiProperty({ example: 1, description: 'ID of the purchase item' })
  id: number;

  @ApiProperty({ example: 4, description: 'Quantity of the purchased item' })
  quantity: number;

  @ApiProperty({ example: '100', description: 'Price at the time of purchase' })
  priceAtPurchaseTime: string;

  @ApiProperty({ example: '2024-11-26T13:18:07.816Z', description: 'Purchase date and time' })
  purchasedAt: string;

  @ApiProperty({
    example: {
      id: 2,
      name: 'Product A',
      price: 100,
      version: 1,
    },
    description: 'Details of the purchased product',
  })
  product: {
    id: number;
    name: string;
    price: number;
    version: number;
  };
}
