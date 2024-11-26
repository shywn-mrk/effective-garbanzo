import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.validateUser(username, password);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
