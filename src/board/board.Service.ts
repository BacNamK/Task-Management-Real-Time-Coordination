import { CycleRp } from '../cycle/cycleRepository.js';
import { BoardRepository } from './board.Repository.js';
import { BoardDto } from './board.Dto.js';

export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly cycleRepository: CycleRp,
  ) {}

  async create(name: string, workspaceUuid: string) {
    if (!name) {
      throw new Error('Name is required');
    }
    if (!workspaceUuid) {
      throw new Error('WorkspaceUuid is required');
    }

    const columnsDefautl = [
      {
        id: 'l1',
        name: 'Default',
        item: [
          { id: '0', name: 'To Do' },
          { id: '1', name: 'In Progress' },
          { id: '2', name: 'Done' },
        ],
      },
    ];

    const boardService: BoardDto = {
      name,
      columnsJson: columnsDefautl,
    };
    return await this.boardRepository.create(boardService, workspaceUuid);
  }

  async get(workspaceUuid: string) {
    const boards = await this.boardRepository.get(workspaceUuid);
    return boards;
  }

  async find(boardId: bigint) {
    return await this.boardRepository.find(boardId);
  }

  static async update(boardId: bigint, data: any) {
    // return await BoardRepository.update(boardId, workspaceUuid, data);
  }

  async addCycle(boardId: any) {
    return await this.cycleRepository.create(boardId);
  }
}
