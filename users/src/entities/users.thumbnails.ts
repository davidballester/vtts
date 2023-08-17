import { Username, validateUsername } from './usernames';

export interface UserThumbnail {
  username: Username;
}

export interface NotValidatedUserThumbnail {
  username: string;
}

export function validateUserThumbnail(
  userThumbnail: NotValidatedUserThumbnail,
): asserts userThumbnail is UserThumbnail {
  validateUsername(userThumbnail.username);
}
