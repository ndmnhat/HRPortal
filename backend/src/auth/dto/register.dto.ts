import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Adam Smith' })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: '1@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Secret123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
