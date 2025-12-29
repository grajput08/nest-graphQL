import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from '../tasks/task.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => [Task], { nullable: true })
  tasks?: Task[];

  @Field(() => Date)
  createdAt: Date;
}

