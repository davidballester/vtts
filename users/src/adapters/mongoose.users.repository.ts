import mongoose, { Document, model } from 'mongoose';
import { Email } from 'src/entities/emails';
import { Identity } from 'src/entities/identity';
import { NotValidatedUser, User, validateUser } from 'src/entities/users';
import {
  DeleteUserError,
  ReadUserError,
  SaveUserError,
  UsersRepository,
} from 'src/ports/users.repository';

const UserSchema = new mongoose.Schema({
  identities: [
    {
      system: String,
      id: String,
    },
  ],
  username: String,
  email: String,
  createdAt: Date,
});

interface UserModelInterface extends NotValidatedUser, Document {}

const UserModel = model<UserModelInterface>('User', UserSchema);

export class MongooseUsersRepository implements UsersRepository {
  async create(user: User): Promise<User> {
    try {
      const userModel = new UserModel(user);
      const savedUser = await userModel.save();
      validateUser(savedUser);
      return savedUser;
    } catch (error) {
      throw new SaveUserError(error.message || typeof error);
    }
  }

  async readByIdentity(identity: Identity): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ identity }).exec();
      if (!user) {
        return undefined;
      }
      validateUser(user);
      return user;
    } catch (error) {
      throw new ReadUserError(error.message || typeof error);
    }
  }

  async readByEmail(email: Email): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email }).exec();
      if (!user) {
        return undefined;
      }
      validateUser(user);
      return user;
    } catch (error) {
      throw new ReadUserError(error.message || typeof error);
    }
  }

  async update(user: User): Promise<User> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: user.email },
        user,
        { new: true },
      ).exec();
      if (!updatedUser) {
        throw new SaveUserError('user not found');
      }
      validateUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new SaveUserError(error.message || typeof error);
    }
  }

  async delete(user: User): Promise<User> {
    try {
      const deletedUser = await UserModel.findOneAndDelete(
        { email: user.email },
        { new: true },
      ).exec();
      if (!deletedUser) {
        throw new DeleteUserError('user not found');
      }
      validateUser(deletedUser);
      return deletedUser;
    } catch (error) {
      throw new DeleteUserError(error.message || typeof error);
    }
  }
}
