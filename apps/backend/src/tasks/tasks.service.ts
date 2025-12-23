import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskStatus, TaskPriority } from './task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(status?: TaskStatus): Promise<Task[]> {
    const where = status ? { status } : {};
    return this.prisma.task.findMany({
      where,
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status || TaskStatus.TODO,
        priority: input.priority || TaskPriority.MEDIUM,
        userId: input.userId,
      },
      include: {
        user: true,
      },
    });
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    await this.findOne(id); // Check if task exists

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.status && { status: input.status }),
        ...(input.priority && { priority: input.priority }),
      },
      include: {
        user: true,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.findOne(id); // Check if task exists

    await this.prisma.task.delete({
      where: { id },
    });

    return true;
  }
}
