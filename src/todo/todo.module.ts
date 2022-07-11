import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';

import { DataSource } from 'typeorm';
import { Todo } from './entity/todo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { SideEffectModule } from 'src/sideEffect/sideEffect.module';

@Module({
  imports: [DatabaseModule, SideEffectModule],
  providers: [
    {
      provide: Todo,
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
      inject: [DataSource],
    },
    TodoService,
  ],
  controllers: [TodoController],
})
export class TodoModule {}
