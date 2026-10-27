import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BoardRepository } from './board.Repository.js';
import { BoardService } from './board.Service.js';

@Controller('/board')
export class BoardController {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly boardService: BoardService,
  ) {}

  @Get()
  async getprojectBoards(@Query('projectUuid') uuid: string) {
    return await this.boardRepository.get(uuid);
  }

  @Get('/:id')
  async find(@Param('id') boardId: string) {
    return await this.boardRepository.find(boardId);
  }

  @Post('/create')
  async create(@Body() formData: { boardName: string; projectUuid: string }) {
    console.log(formData);
    return await this.boardService.create(
      formData.boardName,
      formData.projectUuid,
    );
  }

  @Post('/addCycle')
  async addCycle(@Query('boardId') boardId: bigint) {
    return await this.boardService.addCycle(boardId);
  }
}
