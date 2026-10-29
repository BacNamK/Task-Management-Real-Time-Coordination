import type { Task } from '../../task/service/task.type';

export interface Board {
    id: string;
    name: string;
    createdAt: Date;
    description : string;
    cycle?: Cycle[];
    tasks?: Task[];
}

export interface CycleColumn {
    name: string;
    position: number;
}

export interface Cycle {
    id: string;
    title: string;
    position: number;
    columns: CycleColumn[];
    createdAt: Date;
}

export type BoardTask = Pick<
    Task,
    | 'id'
    | 'title'
    | 'position'
    | 'description'
    | 'createdAt'
    | 'dueDate'
    | 'cycleId'
    | 'boardId'
    | 'assigneeds'
>;

export interface BoardDetail extends Omit<Board, 'tasks' | 'cycle'> {
    cycle: Cycle[];
    tasks: BoardTask[];
}

export interface BoardView {
    id: string;
    title: string;
    cycle: Cycle[];
    tasks: Task[];
}

export interface projectBoardList {
    uuid: string;
    name: string;
    boards: Array<{
        id: string;
        name: string;
        _count: { cycle: number; tasks: number };
    }>;
    members: projectBoardMember[];
}

export interface projectBoardMember {
    role: string;
    user: { name: string; image: string | null };
}
