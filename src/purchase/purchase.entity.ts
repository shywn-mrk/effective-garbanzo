import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.purchases)
  user: User;

  @ManyToOne(() => Product, (product) => product.purchases)
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal')
  priceAtPurchaseTime: number;

  @CreateDateColumn()
  purchasedAt: Date;
}
