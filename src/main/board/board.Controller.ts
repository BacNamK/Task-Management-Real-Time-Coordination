import { Controller, Get, Post, Query } from '@nestjs/common';
import { BoardRepository } from './board.Repository.js';
import { BoardService } from './board.Service.js';

@Controller('board')
export class BoardController {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly boardService: BoardService,
  ) {}

  @Get('get')
  async get(@Query('workspaceUuid') workspaceUuid: string) {
    const boards = await this.boardRepository.get(workspaceUuid);
    return boards;
  }

  @Get('find')
  async find(@Query('boardId') boardId: bigint) {
    const board = await this.boardRepository.find(boardId);
    return board;
  }

  @Post('create')
  async create(
    @Query('name') name: string,
    @Query('workspaceUuid') workspaceUuid: string,
  ) {
    await this.boardRepository.create(name, workspaceUuid);
  }

  @Post('addCycle')
  async addCycle(@Query('boardId') boardId: bigint) {
    return await this.boardService.addCycle(boardId);
  }
}
