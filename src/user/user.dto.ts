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
