import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      full_name: 'Test User',
      email: 'test@example.com',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4',
      phone_number: '1234567890',
      city: 'Test City',
      state: 'TS',
      country: 'Test Country',
      nok_name: 'Emergency Contact',
      nok_phone_number: '9876543210',
    };

    it('should return user profile successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getProfile(userId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
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
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: expect.any(Array),
      });
    });
  });

  describe('updateProfile', () => {
    const userId = 1;
    const updateProfileDto: UpdateProfileDto = {
      address_line_1: 'New Address',
      phone_number: '5555555555',
      city: 'New City',
    };

    const existingUser = {
      id: userId,
      full_name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      address_line_1: 'Old Address',
      address_line_2: null,
      phone_number: '1111111111',
      city: 'Old City',
      state: 'OS',
      country: 'Old Country',
      nok_name: null,
      nok_phone_number: null,
    };

    it('should update user profile successfully', async () => {
      const updatedUser = { ...existingUser, ...updateProfileDto };
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, updateProfileDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingUser,
          ...updateProfileDto,
        }),
      );
      expect(result).not.toHaveProperty('password');
      expect(result.address_line_1).toBe(updateProfileDto.address_line_1);
      expect(result.phone_number).toBe(updateProfileDto.phone_number);
      expect(result.city).toBe(updateProfileDto.city);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateProfile(userId, updateProfileDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      const partialUpdateDto: UpdateProfileDto = {
        phone_number: '9999999999',
      };

      const updatedUser = { ...existingUser, ...partialUpdateDto };
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, partialUpdateDto);

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingUser,
          phone_number: partialUpdateDto.phone_number,
        }),
      );
      expect(result).not.toHaveProperty('password');
      expect(result.phone_number).toBe(partialUpdateDto.phone_number);
      expect(result.address_line_1).toBe(existingUser.address_line_1);
    });

    it('should handle email update', async () => {
      const emailUpdateDto: UpdateProfileDto = {
        email: 'newemail@example.com',
        full_name: 'Updated Name',
      };

      const updatedUser = { ...existingUser, ...emailUpdateDto };
      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile(userId, emailUpdateDto);

      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...existingUser,
          ...emailUpdateDto,
        }),
      );
      expect(result.email).toBe(emailUpdateDto.email);
      expect(result.full_name).toBe(emailUpdateDto.full_name);
    });
  });
});
