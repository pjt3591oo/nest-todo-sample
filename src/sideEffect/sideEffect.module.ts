import { Module } from '@nestjs/common';
import { SideEffectService } from './sideEffect.service';

@Module({
  providers: [{
    provide: 'SIDE_EFFECT_SERVICE',
    useFactory: () => {
      return SideEffectService;
    }
  }],
  exports: [{
    provide: 'SIDE_EFFECT_SERVICE',
    useFactory: () => {
      return SideEffectService;
    }
  }],
})
export class SideEffectModule {}