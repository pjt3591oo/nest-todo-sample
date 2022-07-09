import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';

import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';

import { Todo } from './entity/todo.entity';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        name: 'todo',
        type: 'sqlite',
        database: './data_sqlite/controller.sq3',
        entities: [Todo],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}

describe('TodoController', () => {
  let controller: TodoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        {
          provide: 'TODO_REPOSITORY',
          useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
          inject: ['DATA_SOURCE'],
        },
        TodoService
      ],
      controllers: [TodoController],
    }).compile();

    controller = module.get<TodoController>(TodoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('조회', async() => {
    const res = await controller.findAll();
    expect(res.length).toBe(0);
  })

  it('생성', async () => {
    const todo = new Todo();
    todo.name = '생성';
    todo.description = '생성';
    todo.isComplete = 0;
    await controller.create(todo);
    
    const res = await controller.findAll();
    expect(res.length).toBe(1);
  })
  
  it('상태변경', async () => {
    let todo = await controller.find(1);
    todo.isComplete = 1
    await controller.update(1, todo);

    todo = await controller.find(1);

    expect(todo.isComplete).toBe(1);
  })
  
  it('삭제', async () => {
    await controller.delete(1);

    const res = await controller.findAll();
    expect(res.length).toBe(0);
  })
});
