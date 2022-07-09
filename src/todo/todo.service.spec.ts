import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';

import { Todo } from './entity/todo.entity';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        name: 'todo',
        type: 'sqlite',
        database: './data_sqlite/example.sq3',
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

describe('TodoService', () => {
  let service: TodoService;

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
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('조회', async () => {
    const res = await service.findAll();
    expect(res.length).toBe(0);
  })
  
  it('생성', async () => {
    const todo = new Todo();
    todo.name = '생성';
    todo.description = '생성';
    todo.isComplete = 0;
    await service.create(todo);
    
    const res = await service.findAll();
    expect(res.length).toBe(1);
  })
  
  it('상태변경', async () => {
    let todo = await service.find(1);
    todo.isComplete = 1
    await service.update(1, todo);

    todo = await service.find(1);

    expect(todo.isComplete).toBe(1);
  })
  
  it('삭제', async () => {
    await service.delete(1);

    const res = await service.findAll();
    expect(res.length).toBe(0);
  })
});
