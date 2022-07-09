import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Injectable, Module, Query } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { Todo } from '../src/todo/entity/todo.entity';
import { TodoService } from '../src/todo/todo.service';
import { TodoController } from '../src/todo/todo.controller';

const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        name: 'todo',
        type: 'sqlite',
        database: './data_sqlite/e2e.sq3',
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
class DatabaseModule {}

@Injectable()
class SideEffectService {
  constructor() {}

  async getRandom(): Promise<number> {
    return 11234;
  }
}

@Module({
  providers: [{
    provide: 'SIDE_EFFECT_SERVICE',
    useClass: SideEffectService,
  }],
  exports: [{
    provide: 'SIDE_EFFECT_SERVICE',
    useClass: SideEffectService,
  }],
})
class SideEffectModule{}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SideEffectModule],
      providers: [
        {
          provide: 'TODO_REPOSITORY',
          useFactory: (dataSource: DataSource) => dataSource.getRepository(Todo),
          inject: ['DATA_SOURCE'],
        },
        TodoService, 
      ],
      controllers: [TodoController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/todo (GET)', () => {
    return request(app.getHttpServer())
      .get('/todo')
      .expect(200)
      .expect([]);
  });

  it('/todo (POST)', () => {
    return request(app.getHttpServer())
      .post('/todo')
      .type('application/json')
      .send({
        name: '생성',
        description: '생성',
        isComplete: 0,
      })
      .expect(201)
      .expect({
        name: '생성',
        description: '생성 11234',
        isComplete: 0,
        id: 1
      });
  })
});
