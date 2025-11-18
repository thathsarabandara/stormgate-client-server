import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_passwords')
export class UserPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @OneToOne(() => User, user => user.password)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
