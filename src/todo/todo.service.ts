import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @Inject('TODO_REPOSITORY')
    private todoRepository: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async find(id): Promise<Todo> {
    return this.todoRepository.findOne({where: id});
  }

  async create(todo: Todo): Promise<Todo> {
    return this.todoRepository.save(todo);
  }

  async update(id, todo: Todo): Promise<Todo> {
    await this.todoRepository.update(id, todo);
    return this.todoRepository.findOne({where: id});
  }

  async delete(id): Promise<Todo> {
    const todo = await this.todoRepository.findOne({where: id});
    await this.todoRepository.remove(todo);
    return todo;
  }
}
