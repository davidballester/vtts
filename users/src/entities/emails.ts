export type Email = string & { _emailBrand: never };

export function validateEmail(email: string): asserts email is Email {
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(email)) {
    throw new InvalidEmailError();
  }
}

export class InvalidEmailError extends Error {}
