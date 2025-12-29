import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { User } from '../users/user.entity';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

registerEnumType(TaskPriority, {
  name: 'TaskPriority',
});

@ObjectType()
export class Task {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => TaskStatus)
  status: TaskStatus;

  @Field(() => TaskPriority)
  priority: TaskPriority;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => ID)
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

