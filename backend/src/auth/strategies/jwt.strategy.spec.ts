import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../../users/user.entity';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-jwt-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user when validation is successful', async () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
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

      mockAuthService.validateUser.mockResolvedValue(mockUser);

      const result = await strategy.validate(payload);

      expect(authService.validateUser).toHaveBeenCalledWith(payload.sub);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const payload = { sub: 999, email: 'nonexistent@example.com' };

      mockAuthService.validateUser.mockResolvedValue(null);

      await expect(strategy.validate(payload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(payload.sub);
    });

    it('should handle validateUser throwing an exception', async () => {
      const payload = { sub: 1, email: 'test@example.com' };
      const error = new UnauthorizedException('User validation failed');

      mockAuthService.validateUser.mockRejectedValue(error);

      await expect(strategy.validate(payload)).rejects.toThrow(error);
      expect(authService.validateUser).toHaveBeenCalledWith(payload.sub);
    });
  });

  describe('constructor', () => {
    it('should be configured with correct JWT settings', () => {
      expect(mockConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
