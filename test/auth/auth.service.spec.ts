import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../src/users/users.service';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    isEmailVerified: true,
    role: 'user',
  };

  const mockToken = 'test.jwt.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmailWithPassword: jest.fn(),
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            save: jest.fn(),
            setUserPassword: jest.fn(),
            createPasswordReset: jest.fn(),
            findByPasswordResetToken: jest.fn(),
            removePasswordReset: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(mockToken),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValueOnce({
        ...mockUser,
        password: { passwordHash: 'hashedpassword' } as any,
      } as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should return null if user is not found', async () => {
      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValueOnce(null);
      const result = await service.validateUser('nonexistent@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      jest.spyOn(usersService, 'findByEmailWithPassword').mockResolvedValueOnce({
        ...mockUser,
        password: { passwordHash: 'hashedpassword' } as any,
      } as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.login({ email: mockUser.email, password: 'password' });
      expect(result).toEqual({
        accessToken: mockToken,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});
