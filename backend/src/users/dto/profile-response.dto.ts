import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: String, nullable: true })
  address_line_1: string | null;

  @ApiProperty({ type: String, nullable: true })
  address_line_2: string | null;

  @ApiProperty({ type: String, nullable: true })
  phone_number: string | null;

  @ApiProperty({ type: String, nullable: true })
  city: string | null;

  @ApiProperty({ type: String, nullable: true })
  state: string | null;

  @ApiProperty({ type: String, nullable: true })
  country: string | null;

  @ApiProperty({ type: String, nullable: true })
  nok_name: string | null;

  @ApiProperty({ type: String, nullable: true })
  nok_phone_number: string | null;
}