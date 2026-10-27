import { Injectable } from '@nestjs/common';
import { CycleRepository } from '../cycle/cycle.Repository.js';
import { BoardRepository } from './board.Repository.js';

@Injectable()
export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly cycleRepository: CycleRepository,
  ) {}

  async create(name: string, projectUuid: string) {
    if (!name) {
      throw new Error('Name is required');
    }
    if (!projectUuid) {
      throw new Error('projectUuid is required');
    }

    const board = JSON.parse(
      await this.boardRepository.create(name, projectUuid),
    ) as { id: string };

    const cycle = JSON.parse(
      await this.cycleRepository.create(BigInt(board.id)),
    );

    return { ...board, cycle };
  }

  async find(boardId: bigint) {
    return await this.boardRepository.get(boardId);
  }

  static async update(boardId: bigint, data: any) {
    // return await BoardRepository.update(boardId, projectUuid, data);
  }

  async addCycle(boardId: string | bigint) {
    return await this.cycleRepository.create(BigInt(boardId));
  }
}
