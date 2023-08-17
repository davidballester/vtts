import {
  Args,
  Context,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UserGraphQl } from './users.graphql';
import { UsersInteractor } from 'src/interactors/users.interactor';
import { UserThumbnailGraphQl } from './users.thumbnails.graphql';
import { User } from 'src/entities/users';
import { UserThumbnail } from 'src/entities/users.thumbnails';

export interface UsersResolverContext {
  user: User;
}

@InputType()
class UserInput {
  @Field(() => [IdenttiyCreateInput])
  identities: IdenttiyCreateInput[];

  @Field()
  username: string;

  @Field()
  email: string;
}

@InputType()
class IdenttiyCreateInput {
  @Field()
  system: string;

  @Field()
  id: string;
}

@Resolver(UserGraphQl)
export class UsersResolver {
  constructor(private interactor: UsersInteractor) {}

  @Mutation(() => UserGraphQl)
  async create(
    @Args('user') notValidatedUser: UserInput,
  ): Promise<UserGraphQl> {
    const user = await this.interactor.create(notValidatedUser);
    return this.userToUserGraphQl(user);
  }

  @Query(() => UserGraphQl, { nullable: true })
  async readByIdentity(
    @Args('system') system: string,
    @Args('id') id: string,
  ): Promise<UserGraphQl | undefined> {
    const user = await this.interactor.readByIdentity({ system, id });
    return user ? this.userToUserGraphQl(user) : undefined;
  }

  @Query(() => UserThumbnailGraphQl, { nullable: true })
  async readByEmail(
    @Context() { user }: UsersResolverContext,
    @Args('email') email: string,
  ): Promise<UserThumbnailGraphQl | undefined> {
    const userThumbnail = await this.interactor.readThumbnailByEmail(
      user,
      email,
    );
    return userThumbnail
      ? this.userThumbnailToUserThumbnailGraphQl(userThumbnail)
      : undefined;
  }

  @Mutation(() => UserGraphQl)
  async update(
    @Context() { user }: UsersResolverContext,
    @Args('user') notValidatedUser: UserInput,
  ): Promise<UserGraphQl> {
    const updatedUser = await this.interactor.update(user, notValidatedUser);
    return this.userToUserGraphQl(updatedUser);
  }

  @Mutation(() => UserGraphQl)
  async delete(
    @Context() { user }: UsersResolverContext,
  ): Promise<UserGraphQl> {
    const deletedUser = await this.interactor.delete(user);
    return this.userToUserGraphQl(deletedUser);
  }

  private userToUserGraphQl(user: User): UserGraphQl {
    return {
      username: user.username,
      createdAt: user.createdAt,
      email: user.email,
      identities: user.identities.map(({ system, id }) => ({ system, id })),
    };
  }

  private userThumbnailToUserThumbnailGraphQl(
    userThumbnail: UserThumbnail,
  ): UserThumbnailGraphQl {
    return {
      email: userThumbnail.email,
      username: userThumbnail.username,
    };
  }
}
