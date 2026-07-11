import { IsString, Length, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  identifier: string;

  @IsString()
  @MinLength(8)
  password: string;
}
