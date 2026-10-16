export interface Task {
    id: bigint;
    title: string;
    position: number;
    description?: string;
    cycleId: bigint;
    boardId: bigint;
    creatorId: number;
    createdAt: Date;
    dueDate?: Date;
    updatedAt?: Date;
}

export type TaskChangePosition = Pick<Task, 'position' | 'boardId' | 'cycleId'>;
