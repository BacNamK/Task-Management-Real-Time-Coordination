import { prisma } from '../lib/prisma.Client.js';

export class CycleRp {
  constructor() {}

  async create(boardId: number) {
    return prisma.cycle.create({
      data: {
        title: 'Default',
        position: 0,
        boardId: boardId,
        columns: [
          { position: 0, name: 'To Do' },
          { position: 1, name: 'In Progress' },
          { position: 2, name: 'Done' },
        ],
      },
    });
  }

  async updateColumnsRp(id: any, rawdData: any) {
    return prisma.cycle.update({
      where: { id: id },
      data: {
        columns: rawdData,
      },
    });
  }
}
