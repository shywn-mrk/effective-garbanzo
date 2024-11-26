import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { LoginUserDto } from './user.dto';

const mockUserService = {
  createUser: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
  findByUsername: jest.fn().mockResolvedValue({ id: 1, username: 'testuser', password: 'hashedPassword' }),
  register: jest.fn().mockResolvedValue({ id: 1, username: 'testuser' }),
};

const mockAuthService = {
  login: jest.fn().mockResolvedValue({ access_token: 'jwt_token' }),
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
        JwtService,
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto = { username: 'testuser', password: 'password123' };
      await userController.register(createUserDto.username, createUserDto.password);

      expect(userService.register).toHaveBeenCalledWith(createUserDto.username, createUserDto.password);
    });
  });

  describe('login', () => {
    it('should login and return a JWT token', async () => {
      const loginDto: LoginUserDto = { username: 'testuser', password: 'password123' };
      await userController.login(loginDto.username, loginDto.password);

      expect(authService.login).toHaveBeenCalledWith(loginDto.username, loginDto.password);
      expect(await userController.login(loginDto.username, loginDto.password)).toEqual({
        accessToken: { access_token: 'jwt_token' },
      });
    });

    it('should throw an error if the user does not exist', async () => {
      mockAuthService.login = jest.fn().mockRejectedValue(new NotFoundException('User not found'));

      await expect(userController.login('invaliduser', 'password123')).rejects.toThrow(NotFoundException);
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

      await expect(userController.login('testuser', 'wrongpassword')).rejects.toThrow('Invalid credentials');
    });
  });
});
