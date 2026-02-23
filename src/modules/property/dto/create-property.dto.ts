import { IsNumber, IsString } from 'class-validator';

export class PropertyDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}
