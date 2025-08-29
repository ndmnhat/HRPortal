import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
  };

  const mockCurrentUser: User = {
    id: 1,
    email: 'current@example.com',
    full_name: 'Current User',
    password: 'hashedPassword',
    address_line_1: null,
    address_line_2: null,
    phone_number: null,
    city: null,
    state: null,
    country: null,
    nok_name: null,
    nok_phone_number: null,
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return current user profile successfully', async () => {
      const expectedProfile = {
        id: mockCurrentUser.id,
        full_name: 'Test User',
        email: 'test@example.com',
        address_line_1: '123 Main St',
        address_line_2: null,
        phone_number: '1234567890',
        city: 'Test City',
        state: 'TS',
        country: 'Test Country',
        nok_name: 'Emergency Contact',
        nok_phone_number: '9876543210',
      };

      mockUsersService.getProfile.mockResolvedValue(expectedProfile);

      const result = await controller.getProfile(mockCurrentUser);

      expect(usersService.getProfile).toHaveBeenCalledWith(mockCurrentUser.id);
      expect(result).toEqual(expectedProfile);
    });

    it('should handle errors when getting profile', async () => {
      const error = new Error('User not found');
      mockUsersService.getProfile.mockRejectedValue(error);

      await expect(controller.getProfile(mockCurrentUser)).rejects.toThrow(
        error,
      );
      expect(usersService.getProfile).toHaveBeenCalledWith(mockCurrentUser.id);
    });

    it('should use current user id from JWT', async () => {
      const differentUser: User = {
        ...mockCurrentUser,
        id: 5,
        email: 'different@example.com',
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      };

      const expectedProfile = {
        id: differentUser.id,
        full_name: 'Another User',
        email: 'another@example.com',
      };

      mockUsersService.getProfile.mockResolvedValue(expectedProfile);

      const result = await controller.getProfile(differentUser);

      expect(usersService.getProfile).toHaveBeenCalledWith(differentUser.id);
      expect(result).toEqual(expectedProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update current user profile successfully', async () => {
      const updateProfileDto: UpdateProfileDto = {
        address_line_1: 'New Address',
        phone_number: '5555555555',
        city: 'New City',
      };

      const expectedResult = {
        id: mockCurrentUser.id,
        full_name: 'Test User',
        email: 'test@example.com',
        address_line_1: updateProfileDto.address_line_1,
        address_line_2: null,
        phone_number: updateProfileDto.phone_number,
        city: updateProfileDto.city,
        state: null,
        country: null,
        nok_name: null,
        nok_phone_number: null,
      };

      mockUsersService.updateProfile.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(
        updateProfileDto,
        mockCurrentUser,
      );

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        mockCurrentUser.id,
        updateProfileDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle partial updates', async () => {
      const differentUser: User = {
        ...mockCurrentUser,
        id: 2,
        email: 'user@example.com',
        hashPassword: jest.fn(),
        validatePassword: jest.fn(),
      };

      const updateProfileDto: UpdateProfileDto = {
        phone_number: '9999999999',
      };

      const expectedResult = {
        id: differentUser.id,
        full_name: 'User Name',
        email: 'user@example.com',
        phone_number: updateProfileDto.phone_number,
      };

      mockUsersService.updateProfile.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(
        updateProfileDto,
        differentUser,
      );

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        differentUser.id,
        updateProfileDto,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors when updating profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        address_line_1: 'New Address',
      };
      const error = new Error('User not found');
      mockUsersService.updateProfile.mockRejectedValue(error);

      await expect(
        controller.updateProfile(updateProfileDto, mockCurrentUser),
      ).rejects.toThrow(error);
      expect(usersService.updateProfile).toHaveBeenCalledWith(
        mockCurrentUser.id,
        updateProfileDto,
      );
    });

    it('should handle empty update data', async () => {
      const updateProfileDto: UpdateProfileDto = {};

      const expectedResult = {
        id: mockCurrentUser.id,
        full_name: 'Test User',
        email: 'test@example.com',
      };

      mockUsersService.updateProfile.mockResolvedValue(expectedResult);

      const result = await controller.updateProfile(
        updateProfileDto,
        mockCurrentUser,
      );

      expect(usersService.updateProfile).toHaveBeenCalledWith(
        mockCurrentUser.id,
        updateProfileDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
