import { Module } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase, User, Product]),
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [PurchaseService],
  controllers: [PurchaseController]
})
export class PurchaseModule {}
