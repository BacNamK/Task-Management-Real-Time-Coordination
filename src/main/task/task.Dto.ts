export interface Task {
    title: string;
    description: string;
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
