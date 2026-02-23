import { CategoryEnitity } from 'src/modules/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  genrated_id: number;

  @Column('integer')
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @ManyToMany(() => CategoryEnitity, { lazy: true })
  @JoinColumn({ name: 'product_categories' })
  categories: Promise<CategoryEnitity[]>;
}
