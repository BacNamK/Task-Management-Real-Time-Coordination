import { Injectable } from '@nestjs/common';
import { CycleRepository } from './cycle.Repository.js';

@Injectable()
export class CycleService {
  constructor(private readonly cycleRepository: CycleRepository) {}

  async create(boardId: string) {
    if (!boardId) return;
    this.cycleRepository.create(BigInt(boardId));
  }
  async update(cycleId: string, columns: any) {
    if (!cycleId) return;
    this.cycleRepository.updateColumns(cycleId, columns);
  }
}
