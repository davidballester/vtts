import { validateIdentity } from 'src/entities/identities';
import {
  NotValidatedUserThumbnail,
  UserThumbnail,
  validateUserThumbnail,
} from 'src/entities/users.thumbnails';
import { NotValidatedUser, User, validateUser } from 'src/entities/users';
import { UsersRepository } from 'src/ports/users.repository';
import { v4 as uuidv4 } from 'uuid';

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
        identities: [
          ...(userInput.identities ?? []),
          {
            system: process.env.VTT_SYSTEM || 'vtt',
            id: uuidv4(),
          },
        ],
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

  async readUserThumbnailByIdentity(identity: {
    system: string;
    id: string;
  }): Promise<UserThumbnail | undefined> {
    try {
      validateIdentity(identity);
      const user = await this.repository.readByIdentity(identity);
      if (!user) {
        return undefined;
      }
      const userThumbnail: NotValidatedUserThumbnail = {
        username: user.username,
      };
      validateUserThumbnail(userThumbnail);
      return userThumbnail;
    } catch (error) {
      this.logger.error(
        'readThumbnailByIdentity',
        identity,
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
        identities: user.identities,
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
