import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../../src/users/users.service';
import { AuthService } from '../../src/auth/auth.service';
import { User } from '../../src/users/entities/user.entity';
import { UserPassword } from '../../src/users/entities/user-password.entity';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    password: { passwordHash: 'hashedpassword' } as UserPassword,
    isEmailVerified: true,
    role: 'user' as const,
    otpCode: null,
    otpExpiresAt: null,
    googleId: null,
    tokens: [],
    refreshTokens: [],
    passwordResets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    hasId: () => true,
    save: () => Promise.resolve(mockUser as unknown as User),
    remove: () => Promise.resolve(mockUser as unknown as User),
    reload: () => Promise.resolve(mockUser as unknown as User),
  } as unknown as User;

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
      const userWithPassword: User = {
        ...mockUser,
        password: { passwordHash: 'hashedpassword' } as UserPassword,
      } as unknown as User;

      const findByEmailSpy = jest
        .spyOn(usersService, 'findByEmailWithPassword')
        .mockResolvedValueOnce(userWithPassword);

      const compareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation((): Promise<boolean> => {
          return Promise.resolve(true);
        });

      await expect(
        service.validateUser('test@example.com', 'password'),
      ).resolves.toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        role: mockUser.role,
      });

      expect(findByEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(compareSpy).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should return null if user is not found', async () => {
      jest
        .spyOn(usersService, 'findByEmailWithPassword')
        .mockResolvedValueOnce(null);
      const result = service.validateUser(
        'nonexistent@example.com',
        'password',
      );
      await expect(result).resolves.toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const userWithPassword: User = {
        ...mockUser,
        password: { passwordHash: 'hashedpassword' } as UserPassword,
      } as User;

      jest
        .spyOn(usersService, 'findByEmailWithPassword')
        .mockResolvedValueOnce(userWithPassword);

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
        return Promise.resolve(true);
      });

      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementation((): Promise<string> => {
          return Promise.resolve(mockToken);
        });

      await expect(
        service.login({
          email: mockUser.email,
          password: 'password',
        }),
      ).resolves.toEqual({
        accessToken: mockToken,
      });
      expect(signAsyncSpy).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});
