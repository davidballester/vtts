import { Id, validateId } from './ids';
import { System, validateSystem } from './systems';

export interface Identity {
  system: System;
  id: Id;
}

export function validateIdentity(identity: {
  system: string;
  id: string;
}): asserts identity is Identity {
  validateSystem(identity.system);
  validateId(identity.id);
}
