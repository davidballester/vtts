import { validateEmail } from 'src/entities/emails';
import { validateIdentity } from 'src/entities/identities';
import {
  NotValidatedUserThumbnail,
  UserThumbnail,
  validateUserThumbnail,
} from 'src/entities/users.thumbnails';
import { NotValidatedUser, User, validateUser } from 'src/entities/users';
import { UsersRepository } from 'src/ports/users.repository';

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

  async create(user: NotValidatedUser): Promise<User> {
    try {
      validateUser(user);
      const existingUser = await this.repository.readByEmail(user.email);
      if (existingUser) {
        throw new EmailAlreadyInUseError();
      }
      user.createdAt = new Date();
      const savedUser = await this.repository.create(user);
      this.logger.info('create', savedUser);
      return savedUser;
    } catch (error) {
      this.logger.error('create', user, typeof error, error.message);
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

  async update(user: User, updatedUser: NotValidatedUser): Promise<User> {
    try {
      validateUser(updatedUser);
      if (user.email !== updatedUser.email) {
        throw new UnauthorizedError();
      }
      this.logger.info('update', user.email, updatedUser);
      return await this.repository.update(updatedUser);
    } catch (error) {
      this.logger.error(
        'update',
        user.email,
        updatedUser,
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
