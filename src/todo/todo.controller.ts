import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { SideEffectService } from '../sideEffect/sideEffect.service';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    @Inject('SIDE_EFFECT_SERVICE') private readonly sideEffectService: SideEffectService,
  ) {}

  @Get()
  findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Get(':id')
  find(@Param('id') id): Promise<Todo> {
    return this.todoService.find(id);
  }

  @Post()
  async create(@Body() todo: Todo): Promise<Todo> {
    const random = await this.sideEffectService.getRandom();
    todo.description = `${todo.description} ${random}`;
    return this.todoService.create(todo);
  }

  @Put(':id')
  update(@Param('id') id, todo: Todo): Promise<Todo> {
    return this.todoService.update(id, todo);
  }

  @Delete(':id')
  delete(@Param('id') id): Promise<Todo> {
    return this.todoService.delete(id);
  }
}