import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { LoginUserDto } from '../user/user.dto';

const mockUserService = {
  createUser: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
  findByUsername: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', password: 'hashedPassword' }),
  register: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
};

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
};

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        JwtService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto = { username: 'testuser', password: 'password123' };
      await authController.register(createUserDto.username, createUserDto.password);

      expect(userService.register).toHaveBeenCalledWith(createUserDto.username, createUserDto.password);
    });
  });

  describe('login', () => {
    it('should login and return a JWT token', async () => {
      const loginDto: LoginUserDto = { username: 'testuser', password: 'password123' };
      await authController.login(loginDto.username, loginDto.password);

      expect(authService.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(await authController.login(loginDto.username, loginDto.password)).toEqual({
        accessToken: { access_token: 'jwt_token' },
      });
    });

    it('should throw an error if the user does not exist', async () => {
      mockAuthService.login = jest.fn().mockRejectedValue(new NotFoundException('User not found'));

      await expect(authController.login('invaliduser', 'password123')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the password is incorrect', async () => {
      mockUserService.findByUsername.mockResolvedValueOnce({
        id: 1,
        username: 'testuser',
        password: 'hashedPassword',
      });
      mockAuthService.login.mockImplementationOnce(() => {
        throw new Error('Invalid credentials');
      });

      await expect(authController.login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });
});
