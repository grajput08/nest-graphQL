import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Query(() => [Task], { name: 'getTasks' })
  async getTasks(
    @Args('status', { nullable: true, type: () => TaskStatus }) status?: TaskStatus,
  ): Promise<Task[]> {
    return this.tasksService.findAll(status);
  }

  @Query(() => Task, { name: 'getTask' })
  async getTask(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => Task)
  async createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.tasksService.create(input);
  }

  @Mutation(() => Task)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTaskInput,
  ): Promise<Task> {
    return this.tasksService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteTask(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.tasksService.delete(id);
  }
}

