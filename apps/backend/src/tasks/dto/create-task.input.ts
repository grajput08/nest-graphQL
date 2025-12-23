import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { TaskStatus, TaskPriority } from '../task.entity';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => TaskStatus, { nullable: true, defaultValue: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @Field(() => TaskPriority, { nullable: true, defaultValue: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @Field()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

