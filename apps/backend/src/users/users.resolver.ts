import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'getUsers' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
}

