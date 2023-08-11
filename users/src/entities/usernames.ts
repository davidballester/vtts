export type Username = string & { _usernameBrand: never };

export function validateUsername(
  username: string,
): asserts username is Username {
  if (!/[a-zA-Z\.-_0-9]{3,}/.test(username)) {
    throw new InvalidUsernameError();
  }
}

export class InvalidUsernameError extends Error {}
