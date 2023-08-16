import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersResolver, UsersResolverContext } from './graphql/users.resolver';
import { UsersInteractor } from 'src/interactors/users.interactor';
import { MongooseUsersRepository } from './mongoose.users.repository';
import { ConsoleLogger } from './console.logger';
import { User, validateUser } from 'src/entities/users';
import mongoose from 'mongoose';
import 'dotenv/config';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: graphQlContextFn,
    }),
  ],
  providers: [
    {
      provide: UsersResolver,
      useValue: getUsersResolver(),
    },
  ],
})
export class AppModule {
  constructor() {
    mongoose.connect(
      process.env.MONGO_CONNECTION || 'mongodb://127.0.0.1:27017/users',
    );
  }
}

function getUsersResolver() {
  const interactor = getUsersInteractor();
  return new UsersResolver(interactor);
}

function getUsersInteractor() {
  const repository = getUsersRepository();
  const logger = getLogger();
  return new UsersInteractor({ repository, logger });
}

function getUsersRepository() {
  return new MongooseUsersRepository();
}

function getLogger() {
  return new ConsoleLogger();
}

function graphQlContextFn(): UsersResolverContext {
  // TODO:
  const fakeUser = getFakeUser();
  return {
    user: fakeUser,
  };
}

function getFakeUser(): User {
  const user = {
    createdAt: new Date(),
    email: 'kingarthur@camelot.en',
    identities: [],
    username: 'kingarthur',
  };
  validateUser(user);
  return user;
}
