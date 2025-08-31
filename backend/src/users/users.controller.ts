import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './user.entity';

@ApiTags('Users')
@Controller('api/v1/profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@CurrentUser() currentUser: User): Promise<ProfileResponseDto> {
    return this.usersService.getProfile(currentUser.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() currentUser: User,
  ): Promise<ProfileResponseDto> {
    return this.usersService.updateProfile(currentUser.id, updateProfileDto);
  }
}
