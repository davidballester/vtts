import { Email } from 'src/entities/emails';
import { Identity } from 'src/entities/identities';
import { User } from 'src/entities/users';

export interface UsersRepository {
  create(user: User): Promise<User>;
  readByIdentity(identity: Identity): Promise<User | undefined>;
  readByEmail(email: Email): Promise<User | undefined>;
  update(user: User): Promise<User>;
  delete(user: User): Promise<User>;
}

export class SaveUserError extends Error {}

export class ReadUserError extends Error {}

export class DeleteUserError extends Error {}
