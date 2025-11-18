import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import type { UserPassword } from './user-password.entity';
import type { Token } from './token.entity';
import type { RefreshToken } from './refresh-token.entity';
import type { PasswordReset } from './password-reset.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: 'user' | 'admin';

  @Column({ nullable: true })
  otpCode: string | null;

  @Column({ type: 'datetime', nullable: true })
  otpExpiresAt: Date | null;

  @Column({ nullable: true })
  googleId: string | null;

  @OneToOne('UserPassword', 'user', { cascade: true })
  @JoinColumn()
  password: UserPassword;

  @OneToMany('Token', 'user', { cascade: true })
  tokens: Token[];

  @OneToMany('RefreshToken', 'user', { cascade: true })
  refreshTokens: RefreshToken[];

  @OneToMany('PasswordReset', 'user', { cascade: true })
  passwordResets: PasswordReset[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
