import { IsNotEmpty, IsNumber } from 'class-validator';
import { Category } from 'src/modules/category/entities/category.schema';

export class CreateProductDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;

  categories: Category[];
}
