import { UserType } from '../../user/service/user.type';

export interface TaskAssignee {
    id: string;
    user: {
        id: string;
        name: string;
        avatar: string | null;
    };
}

type User = Pick<UserType, 'id' | 'name' | 'avatar'>;

export interface Task {
    id: string;
    title: string;
    position: number;
    description?: string;
    priority: number;
    censor: User;
    cycleId: string | null;
    boardId: string;
    creatorId: string;
    createdAt: Date;
    dueDate?: Date;
    updatedAt?: Date;
    assigneeds: TaskAssignee[];
}

export type TaskCreate = Pick<
    Task,
    'title' | 'position' | 'description' | 'cycleId' | 'boardId' | 'dueDate'
> & {
    assigneeds: Array<{ userId: string }>;
};

export type TaskChangePosition = Pick<Task, 'position' | 'cycleId' | 'id'>;
