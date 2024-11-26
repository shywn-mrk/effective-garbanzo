import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto, LoginUserDto, RegisterUserDto } from '../user/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterUserDto })
    @ApiResponse({ status: 201, description: 'The user has been successfully registered.', type: RegisterUserDto })
    @ApiResponse({ status: 400, description: 'Invalid input or username already exists.' })
    async register(@Body('username') username: string, @Body('password') password: string) {
      return this.userService.register(username, password);
    }
  
    @Post('login')
    @ApiOperation({ summary: 'Login an existing user' })
    @ApiBody({ type: LoginUserDto })
    @ApiResponse({ status: 200, description: 'Successfully authenticated.', type: LoginResponseDto })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    async login(@Body('username') username: string, @Body('password') password: string) {
      const token = await this.authService.login(username, password);
      if (!token) return { message: 'Invalid credentials' };
      return { accessToken: token };
    }
}
