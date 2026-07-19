import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Логин должен быть от 3 символов' })
  login: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email' })
  email?: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть от 6 символов' })
  password: string;
}

export class LoginDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}