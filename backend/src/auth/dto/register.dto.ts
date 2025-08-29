import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  MaxLength,
  Matches,
  IsStrongPassword
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    example: 'Adam Smith',
    description: 'Full name of the user',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Full name must not exceed 100 characters' })
  @Matches(/^[a-zA-Z\s'-]+$/, { 
    message: 'Full name can only contain letters, spaces, hyphens and apostrophes' 
  })
  full_name: string;

  @ApiProperty({ 
    example: '1@gmail.com',
    description: 'Email address of the user'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @Matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, {
    message: 'Email address is not valid'
  })
  email: string;

  @ApiProperty({ 
    example: 'Secret123!',
    description: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 2,
    minSymbols: 2
  }, { 
    message: 'Password must contain at least two numbers, and two special characters' 
  })
  password: string;
}
