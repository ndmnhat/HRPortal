import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'full_name',
        'email',
        'address_line_1',
        'address_line_2',
        'phone_number',
        'city',
        'state',
        'country',
        'nok_name',
        'nok_phone_number',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const existingUser = await this.userRepository.findOne({
      where: { id: Not(userId), email: updateProfileDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateProfileDto);

    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result as ProfileResponseDto;
  }
}
