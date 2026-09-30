export interface Task {
    title: string;
    description: string;
    createdAt: Date;
    dueDate: Date;
    position: Number;
    cycleId: bigint | null;
    boardId: any;
}

export interface TaskData extends Task {
    creatorId: number;
}

export interface assigneeds {
    userId: string[];
}

export type assignTask = {
    task: Task;
    assigneeds: assigneeds[];
};
