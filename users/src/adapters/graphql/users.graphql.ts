import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IdentityGraphQl {
  @Field()
  system: string;

  @Field()
  id: string;
}

@ObjectType()
export class UserGraphQl {
  @Field(() => [IdentityGraphQl])
  identities: IdentityGraphQl[];

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}
