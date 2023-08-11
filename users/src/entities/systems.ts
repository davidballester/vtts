export type System = string & { _systemBrand: never };

export function validateSystem(system: string): asserts system is System {
  if (!/[a-zA-Z\.-_0-9]{3,}/.test(system)) {
    throw new InvalidSystemError();
  }
}

export class InvalidSystemError extends Error {}
