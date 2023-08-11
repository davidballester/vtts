export type Id = string & { _idBrand: never };

export function validateId(id: string): asserts id is Id {
  if (!/[a-zA-Z\.-_0-9]{3,}/.test(id)) {
    throw new InvalidIdError();
  }
}

export class InvalidIdError extends Error {}
