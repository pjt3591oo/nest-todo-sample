import { Injectable } from '@nestjs/common';
import { ISideEffect } from './ISideEffect.interface';

@Injectable()
export class SideEffectService implements ISideEffect{
  constructor(
  ) {}

  async getRandom(): Promise<number> {
    return Math.random();
  }
}
