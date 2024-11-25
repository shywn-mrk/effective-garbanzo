import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'blu',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,  // Set to false in production
    }),
    ProductModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
