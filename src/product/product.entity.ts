import { Purchase } from '../purchase/purchase.entity';
import { Entity, PrimaryGeneratedColumn, Column, VersionColumn, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @VersionColumn()
  version: number;

  @OneToMany(() => Purchase, (purchase) => purchase.user)
  purchases: Purchase[];
}
