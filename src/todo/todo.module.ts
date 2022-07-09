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
      provide: 'TODO_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
      inject: ['DATA_SOURCE'],
    },
    TodoService
  ],
  controllers: [TodoController]
})
export class TodoModule { }
