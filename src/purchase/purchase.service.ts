import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './purchase.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createPurchase(userId: number, productId: number, quantity: number): Promise<Purchase> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!user || !product) {
      throw new Error('User or Product not found');
    }

    const purchase = this.purchaseRepository.create({
      user,
      product,
      quantity,
      priceAtPurchaseTime: product.price,
    });

    return this.purchaseRepository.save(purchase);;
  }

  async getUserPurchases(userId: number, page: number, limit: number): Promise<Purchase[]> {
    const [purchases, total] = await this.purchaseRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { purchasedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return purchases;
  }
}
