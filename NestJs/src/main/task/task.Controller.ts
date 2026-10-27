import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { TaskService } from './task.Service.js';
import { TaskDto } from './task.Dto.js';
import { UserId } from '../../common/decorators/decorator-id.js';

@Controller('task')
export class TaskController {
  constructor(private readonly Service: TaskService) {}

  @Get('/get')
  async get(@Query('boardId') boardId: bigint) {
    return await this.Service.get(boardId);
  }

  @Post('/create')
  async create(@Body() data: TaskDto, @UserId() userId: string) {
    return await this.Service.create(data, userId);
  }

  @Patch('/update')
  async update(
    @Query('id') id: bigint,
    @Body() data: any,
    @UserId() userId: bigint,
  ) {
    return await this.Service.update(id, data, userId);
  }
  @Patch('/position')
  async changePosition(
    @Body() data: { taskId: bigint; cycleId: bigint; position: number },
  ) {
    return await this.Service.changePosition(data);
  }
}
