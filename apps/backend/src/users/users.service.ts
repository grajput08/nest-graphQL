import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        tasks: true,
      },
    }) as Promise<User[]>;
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        tasks: true,
      },
    }) as Promise<User | null>;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<User | null>;
  }

  async create(data: { name: string; email: string }): Promise<User> {
    return this.prisma.user.create({
      data,
      include: {
        tasks: true,
      },
    }) as Promise<User>;
  }
}
