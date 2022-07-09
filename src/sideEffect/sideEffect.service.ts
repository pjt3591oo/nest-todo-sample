import { Injectable } from '@nestjs/common';

@Injectable()
export class SideEffectService {
  constructor(
  ) {}

  async getRandom(): Promise<number> {
    return Math.random();
  }
}
