import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PurchaseService } from '../purchase/purchase.service';
import { Purchase } from '../purchase/purchase.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Purchase, Product]),
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PurchaseService],
  exports: [UserService, PurchaseService],
})
export class UserModule {}
