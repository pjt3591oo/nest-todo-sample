import { Module } from '@nestjs/common';
import { SideEffectService } from './sideEffect.service';

@Module({
  providers: [{
    provide: SideEffectService,
    useFactory: () => {
      return SideEffectService;
    }
  }],
  exports: [{
    provide: SideEffectService,
    useFactory: () => {
      return SideEffectService;
    }
  }],
})
export class SideEffectModule {}