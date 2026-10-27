import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CycleService } from './cycle.Service.js';
import { CycleRepository } from './cycle.Repository.js';

@Controller('/cycle')
export class CycleController {
  constructor(
    private readonly Service: CycleService,
    private readonly Repository: CycleRepository,
  ) {}
  @Post('/add')
  async create(@Query('boardId') boardId: string) {
    this.Service.create(boardId);
  }

  @Put('/put/:id')
  async put(@Body() body: any, @Param('id') cycleId: string) {
    this.Service.update(cycleId, body);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.Repository.delete(id);
  }
}
