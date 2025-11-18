import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';
import { UserPassword } from '../../src/users/entities/user-password.entity';
import { PasswordReset } from '../../src/users/entities/password-reset.entity';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let userPasswordRepository: Repository<UserPassword>;
  let passwordResetRepository: Repository<PasswordReset>;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const USER_PASSWORD_REPOSITORY_TOKEN = getRepositoryToken(UserPassword);
  const PASSWORD_RESET_REPOSITORY_TOKEN = getRepositoryToken(PasswordReset);

  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    isEmailVerified: false,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: USER_PASSWORD_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn().mockResolvedValue({}),
            findOne: jest.fn(),
          },
        },
        {
          provide: PASSWORD_RESET_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    userPasswordRepository = module.get<Repository<UserPassword>>(USER_PASSWORD_REPOSITORY_TOKEN);
    passwordResetRepository = module.get<Repository<PasswordReset>>(PASSWORD_RESET_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const result = await service.findById(userId);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      const result = await service.findById(999);
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const result = await service.findByEmail(email);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email }
      });
      expect(result).toEqual(mockUser);
    });
  });
});
