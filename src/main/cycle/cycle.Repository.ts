import { Injectable } from '@nestjs/common';
import { prisma } from '../../lib/prisma.Client.js';
import { serializeBigInt } from '../../common/utils/bigint.util.js';

@Injectable()
export class CycleRepository {
  constructor() {}

  async create(boardId: bigint) {
    const cycle = await prisma.cycle.create({
      data: {
        title: 'Default',
        position: 0,
        boardId: boardId,
        columns: [
          { position: 0, name: 'In Progress' },
          { position: 1, name: 'Done' },
        ],
      },
    });
    return serializeBigInt(cycle);
  }

  async updateColumns(id: any, rawdData: any) {
    const cycle = await prisma.cycle.update({
      where: { id: id },
      data: {
        title: rawdData.nameCycle,
        columns: rawdData.columns,
      },
    });
    return serializeBigInt(cycle);
  }

  async delete(id: any) {
    await prisma.cycle.delete({
      where: { id: id },
    });
  }
}
