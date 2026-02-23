import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CategoryEnitity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
