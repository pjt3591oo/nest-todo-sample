import { Injectable } from '@nestjs/common';

@Injectable()
export class SideEffectService {
  async getRandom(): Promise<number> {
    return Math.random();
  }
}
