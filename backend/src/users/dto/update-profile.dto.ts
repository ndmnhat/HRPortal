import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '1 Mango Road' })
  @IsString()
  @IsOptional()
  address_line_1?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address_line_2?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone_number?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nok_name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  nok_phone_number?: string;
}
