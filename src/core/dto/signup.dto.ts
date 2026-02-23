import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUp {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  rePassword: string;

  @IsEmail()
  email: string;
}
