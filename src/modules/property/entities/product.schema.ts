import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Category } from 'src/modules/category/entities/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop()
  id: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Category' }], required: true })
  categories: Category[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
