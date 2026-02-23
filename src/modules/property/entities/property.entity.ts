import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
