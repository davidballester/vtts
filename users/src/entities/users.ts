import { Email, validateEmail } from './emails';
import { Identity, validateIdentity } from './identity';
import { Username, validateUsername } from './usernames';

export interface User {
  identities: Identity[];
  username: Username;
  email: Email;
  createdAt: Date;
}

export interface NotValidatedUser {
  identities: Array<{
    system: string;
    id: string;
  }>;
  username: string;
  email: string;
  createdAt: Date;
}

export function validateUser(user: NotValidatedUser): asserts user is User {
  user.identities.forEach(validateIdentity);
  validateUsername(user.username);
  validateEmail(user.email);
  const now = new Date();
  if (user.createdAt > now) {
    throw new InvalidUserError();
  }
}

export class InvalidUserError extends Error {}
