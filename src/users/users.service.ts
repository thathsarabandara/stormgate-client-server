import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { UserPassword } from './entities/user-password.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepository: Repository<PasswordReset>,
    @InjectRepository(UserPassword)
    private readonly userPasswordRepository: Repository<UserPassword>,
  ) {}

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  findByPasswordResetToken(token: string) {
    return this.passwordResetRepository.findOne({
      where: { resetToken: token },
      relations: ['user'],
    });
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  createUser(partial: Partial<User>) {
    return this.usersRepository.create(partial);
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['password'],
    });
  }

  async setUserPassword(user: User, passwordHash: string) {
    let userPassword = await this.userPasswordRepository.findOne({ where: { userId: user.id } });

    if (!userPassword) {
      userPassword = this.userPasswordRepository.create({
        user,
        userId: user.id,
        passwordHash,
      });
    } else {
      userPassword.passwordHash = passwordHash;
    }

    await this.userPasswordRepository.save(userPassword);
    return userPassword;
  }

  async createPasswordReset(user: User, token: string, expiresAt: Date) {
    const passwordReset = this.passwordResetRepository.create({
      user,
      userId: user.id,
      resetToken: token,
      resetExpiresAt: expiresAt,
    });

    return this.passwordResetRepository.save(passwordReset);
  }

  async removePasswordReset(passwordReset: PasswordReset) {
    return this.passwordResetRepository.remove(passwordReset);
  }
}
