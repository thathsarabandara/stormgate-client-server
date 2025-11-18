import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const otpCode = this.generateOtp();
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const user = this.usersService.createUser({
      username: dto.name ?? dto.email,
      email: dto.email,
      isEmailVerified: false,
      otpCode,
      otpExpiresAt,
    });

    const savedUser = await this.usersService.save(user);
    await this.usersService.setUserPassword(savedUser, passwordHash);

    this.sendOtpByEmail(savedUser.email, otpCode);

    return {
      message: 'Registered successfully. Please verify OTP sent to email.',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password.passwordHash,
    );
    if (!isPasswordValid) {
      return null;
    }

    const { id, username, email: userEmail, role } = user;
    return { id, username, email: userEmail, role };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email is not verified');
    }

    const accessToken = await this.createAccessToken(user);
    return { accessToken };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.otpCode || !user.otpExpiresAt) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpCode !== dto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP has expired');
    }

    user.isEmailVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await this.usersService.save(user);

    return { message: 'Email verified successfully' };
  }

  async requestPasswordReset(dto: RequestPasswordResetDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return {
        message: 'If the email is registered, a reset link has been sent.',
      };
    }

    const token = this.generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await this.usersService.createPasswordReset(user, token, expiresAt);

    this.sendPasswordResetByEmail(user.email, token);

    return {
      message: 'If the email is registered, a reset link has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const passwordReset = await this.usersService.findByPasswordResetToken(
      dto.token,
    );
    if (!passwordReset || !passwordReset.resetExpiresAt) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (passwordReset.resetExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invalid or expired token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.setUserPassword(passwordReset.user, passwordHash);
    await this.usersService.removePasswordReset(passwordReset);

    return { message: 'Password has been reset successfully' };
  }

  async handleGoogleLogin(profile: {
    id: string;
    email?: string;
    name?: string;
  }) {
    if (!profile.email) {
      throw new BadRequestException(
        'Google account does not have an email address',
      );
    }

    let user = await this.usersService.findByEmail(profile.email);
    if (!user) {
      const newUser = this.usersService.createUser({
        email: profile.email,
        username: profile.name ?? profile.email,
        isEmailVerified: true,
        googleId: profile.id,
      });
      user = await this.usersService.save(newUser);
    } else if (!user.googleId) {
      user.googleId = profile.id;
      user.isEmailVerified = true;
      user = await this.usersService.save(user);
    }

    const accessToken = await this.createAccessToken(user);
    return { accessToken };
  }

  async createAccessToken(user: User) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.signAsync(payload);
  }

  private generateOtp() {
    const value = Math.floor(100000 + Math.random() * 900000);
    return String(value);
  }

  private generateResetToken() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 15)}`;
  }

  private sendOtpByEmail(email: string, otp: string) {
    // Integrate real email provider here

    console.log(`Send OTP ${otp} to ${email}`);
  }

  private sendPasswordResetByEmail(email: string, token: string) {
    // Integrate real email provider here

    console.log(`Send password reset token ${token} to ${email}`);
  }
}
