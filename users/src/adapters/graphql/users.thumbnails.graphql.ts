import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserThumbnailGraphQl {
  @Field()
  username: string;

  @Field()
  email: string;
}
