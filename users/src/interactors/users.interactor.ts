import { validateEmail } from 'src/entities/emails';
import { validateIdentity } from 'src/entities/identities';
import {
  NotValidatedUserThumbnail,
  UserThumbnail,
  validateUserThumbnail,
} from 'src/entities/users.thumbnails';
import { NotValidatedUser, User, validateUser } from 'src/entities/users';
import { UsersRepository } from 'src/ports/users.repository';

export interface UserInput {
  identities: Array<{
    system: string;
    id: string;
  }>;
  username: string;
  email: string;
}

export class UsersInteractor {
  private repository: UsersRepository;
  private logger: Logger;

  constructor({
    repository,
    logger,
  }: {
    repository: UsersRepository;
    logger: Logger;
  }) {
    this.repository = repository;
    this.logger = logger;
    this.logger.setPrefix('UsersInteractor');
  }

  async create(userInput: UserInput): Promise<User> {
    try {
      const user: NotValidatedUser = {
        ...userInput,
        createdAt: new Date(),
      };
      validateUser(user);
      const existingUser = await this.repository.readByEmail(user.email);
      if (existingUser) {
        throw new EmailAlreadyInUseError();
      }
      const savedUser = await this.repository.create(user);
      this.logger.info('create', savedUser);
      return savedUser;
    } catch (error) {
      this.logger.error('create', userInput, typeof error, error.message);
      throw error;
    }
  }

  async readByIdentity(identity: {
    system: string;
    id: string;
  }): Promise<User | undefined> {
    try {
      validateIdentity(identity);
      const user = await this.repository.readByIdentity(identity);
      return user;
    } catch (error) {
      this.logger.error(
        'readByIdentity',
        identity,
        error.message || typeof error,
      );
      throw error;
    }
  }

  async readThumbnailByEmail(
    user: User,
    email: string,
  ): Promise<UserThumbnail | undefined> {
    try {
      validateEmail(email);
      const userFromDatabase = await this.repository.readByEmail(email);
      this.logger.info(
        'readThumbnailByEmail',
        user.email,
        'reads',
        email,
        'gets',
        userFromDatabase,
      );
      if (!userFromDatabase) {
        return undefined;
      }
      const userThumbnail: NotValidatedUserThumbnail = {
        email: userFromDatabase?.email,
        username: userFromDatabase?.username,
      };
      validateUserThumbnail(userThumbnail);
      return userThumbnail;
    } catch (error) {
      this.logger.error(
        'readThumbnailByEmail',
        user.email,
        email,
        error.message || typeof error,
      );
      throw error;
    }
  }

  async update(user: User, userInput: UserInput): Promise<User> {
    try {
      if (user.email !== userInput.email) {
        throw new UnauthorizedError();
      }
      const updatedUser = {
        ...user,
        ...userInput,
      };
      validateUser(updatedUser);
      this.logger.info('update', user.email, updatedUser);
      return await this.repository.update(updatedUser);
    } catch (error) {
      this.logger.error(
        'update',
        user.email,
        userInput,
        error.message || typeof error,
      );
      throw error;
    }
  }

  async delete(user: User): Promise<User> {
    try {
      this.logger.info('delete', user.email);
      return await this.repository.delete(user);
    } catch (error) {
      this.logger.error('delete', user.email, error.message || typeof error);
      throw error;
    }
  }
}

export class EmailAlreadyInUseError extends Error {}

export class UnauthorizedError extends Error {}
