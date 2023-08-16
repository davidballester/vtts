import { Email, validateEmail } from './emails';
import { Username, validateUsername } from './usernames';

export interface UserThumbnail {
  email: Email;
  username: Username;
}

export interface NotValidatedUserThumbnail {
  username: string;
  email: string;
}

export function validateUserThumbnail(
  userThumbnail: NotValidatedUserThumbnail,
): asserts userThumbnail is UserThumbnail {
  validateEmail(userThumbnail.email);
  validateUsername(userThumbnail.username);
}
