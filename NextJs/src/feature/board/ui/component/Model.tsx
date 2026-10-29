'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Info, MoveLeft, Pencil, Plus, Workflow } from 'lucide-react';

import { Create } from '../../../task/ui/form/formTask';
import { useItemsStore } from '../../../../hooks/workspaceHook';
import EditColumnsBoard from '../../../cycle/ui/form/EditColumnsBoard';

import { addAction } from '../../../cycle/service/cylce.action';

import { DragDropProvider } from '@dnd-kit/react';
import DroppableColumn from './DroppableColumn';
import DraggableTask from './DraggableTask';
import { changePosition } from '../../../task/service/task.action';
import type { BoardView, Cycle } from '../../service/board.type';
import type { TaskChangePosition } from '../../../task/service/task.type';
import type { Task } from '../../../task/service/task.type';

export const Model = ({ board, projectUuid }: { board: BoardView; projectUuid: string }) => {
    const [tasks, setTasks] = useState<Task[]>(board.tasks);

    const changePositionTask = (change: {
        id: string;
        cycleId: string | null;
        position: number;
    }) => {
        const { id: taskId, cycleId, position } = change;

        setTasks((prev) =>
            prev.map((item) => (item.id === taskId ? { ...item, cycleId, position } : item))
        );

        setTaskChange({ id: taskId, cycleId, position });
    };

    const [taskChange, setTaskChange] = useState<TaskChangePosition>();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!taskChange) return;
            changePosition(taskChange.id, taskChange.cycleId, taskChange.position);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [taskChange]);

    const [isOpen, setIsOpen] = useState(false);

    const [isEditColumnsOpen, setIsEditColumnsOpen] = useState(false);

    const selectedUser = useItemsStore((state) => state.members);

    const [cycleItem, setCycleItem] = useState<Pick<Cycle, 'id' | 'title' | 'columns'>>();

    // lấy thông in cycle
    const getCycley = (columns: Cycle['columns'], title: string, id: string) => {
        setIsEditColumnsOpen(!isEditColumnsOpen);
        setCycleItem({ columns, title, id });
    };

    const addCycleHandle = async () => {
        await addAction(board.id);
    };

    const taskQueue = tasks.filter((task) => task.cycleId === null);

    return (
        <div className="model-Board relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl bg-slate-50/60 p-4 shadow-sm sm:p-5">
            <DragDropProvider
                onDragEnd={(event) => {
                    const { source, target } = event.operation;

                    if (event.canceled || !source || !target) return;

                    const taskId = source.data?.taskId;
                    const cycleId = target.data?.cycleId;
                    const position = target.data?.position;

                    const numericPosition = Number(position);
                    if (
                        typeof taskId !== 'string' ||
                        (typeof cycleId !== 'string' && cycleId !== null) ||
                        !Number.isFinite(numericPosition)
                    ) {
                        return;
                    }

                    changePositionTask({ id: taskId, cycleId, position: numericPosition });
                }}
            >
                {/* Board header */}
                <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-4">
                            <Link
                                aria-label="Back to project"
                                className="rounded-md p-2 text-slate-600 shadow"
                                href={`/projects/${projectUuid}`}
                            >
                                <MoveLeft />
                            </Link>
                            <h3 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
                                {board.title}
                            </h3>
                            <Info
                                size={16}
                                className="shrink-0 text-slate-400"
                                aria-label="Board"
                            />
                        </div>
                    </div>

                    {/* Add cycle */}
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            onClick={addCycleHandle}
                            className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            <Plus size={16} aria-hidden="true" />
                            <span>Cycle</span>
                        </button>
                        {/* Add task */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <Plus size={16} aria-hidden="true" />
                            <span>Task</span>
                        </button>
                    </div>
                </div>
                <div className="mt-4 shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                Queue
                            </span>
                            <span className="text-xs text-gray-400">
                                {taskQueue.length} {taskQueue.length === 1 ? 'task' : 'tasks'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-3 flex min-h-10 min-w-0 gap-2 overflow-x-auto pb-1">
                        {taskQueue.length > 0 ? (
                            taskQueue.map((task, index) => (
                                <div key={task.id ?? index} className="w-56 shrink-0">
                                    <DraggableTask task={task} cycleColumns={[]} />
                                </div>
                            ))
                        ) : (
                            <p className="flex min-h-10 items-center text-sm text-slate-400">
                                No tasks in the queue.
                            </p>
                        )}
                    </div>
                </div>

                {/* Create task */}
                {isOpen && (
                    <div className="mt-4 shrink-0">
                        <Create
                            users={selectedUser ?? []}
                            boardId={board.id}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                )}

                {/* Cycle */}
                <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto">
                    {board.cycle?.length ? (
                        board.cycle.map((cycle) => (
                            <section
                                key={cycle.id}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                {/* Cycle header */}
                                <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span className="shrink-0 rounded-md bg-indigo-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                                            Cycle
                                        </span>
                                        <h4 className="truncate text-sm font-semibold text-slate-800">
                                            {cycle.title}
                                        </h4>
                                    </div>
                                    <button
                                        onClick={() =>
                                            getCycley(cycle.columns, cycle.title, cycle.id)
                                        }
                                        aria-label={`Edit cycle ${cycle.title}`}
                                        className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                                    >
                                        <Pencil size={15} aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Columns */}
                                <div className="overflow-x-auto">
                                    <div
                                        className="grid min-w-full"
                                        style={{
                                            gridTemplateColumns: `repeat(${Math.max(cycle.columns.length, 1)}, minmax(220px, 1fr))`,
                                        }}
                                    >
                                        {/* No columns */}
                                        {cycle.columns.length === 0 ? (
                                            <p className="px-4 py-6 text-center text-sm text-gray-400">
                                                No columns yet. Edit this cycle to add columns.
                                            </p>
                                        ) : null}
                                        {/* Has columns */}
                                        {cycle.columns.map((item, index: number) => {
                                            const itemTasks = tasks.filter(
                                                (task) =>
                                                    task.cycleId === cycle.id &&
                                                    task.position === item.position
                                            );

                                            return (
                                                <div
                                                    key={item?.position}
                                                    className="min-h-40 min-w-0 border-r border-slate-100 last:border-r-0"
                                                >
                                                    {/* Column title */}
                                                    <div className="border-b border-slate-100 bg-slate-50/70 px-3 py-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-semibold text-slate-400">
                                                                {index + 1}
                                                            </span>
                                                            <p className="truncate text-sm font-medium text-slate-700">
                                                                {item.name}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <DroppableColumn
                                                        key={item?.position}
                                                        cycle={cycle}
                                                        id={String(item.position)}
                                                        task={itemTasks}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center">
                            <div className="flex size-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <Workflow size={20} aria-hidden="true" />
                            </div>
                            <h4 className="mt-3 text-sm font-semibold text-slate-700">
                                No cycles yet
                            </h4>
                            <p className="mt-1 text-sm text-slate-400">
                                Create a cycle to start organizing your tasks.
                            </p>
                        </div>
                    )}
                </div>

                {/* Edit columns */}
                {isEditColumnsOpen && cycleItem && (
                    <EditColumnsBoard
                        cycle={cycleItem}
                        setIsEditColumnsOpen={setIsEditColumnsOpen}
                        boardId={board.id}
                    />
                )}
            </DragDropProvider>
        </div>
    );
};
