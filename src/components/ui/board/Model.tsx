'use client';

import Image from 'next/image';
import { useState } from 'react';

import addIcon from '@/public/add.png';
import infoIcon from '@/public/info-sign.png';

import { CreateTask } from '../../forms/CreateTask';
import { useItemsStore } from '@/src/hooks/workspaceHook';
import EditColumnsBoard from '../../forms/EditColumnsBoard';

import { addCycleBoard } from '@/src/server/actions/board.action';

import { DragDropProvider } from '@dnd-kit/react';
import DroppableColumn from './DroppableColumn';
import DraggableTask from './DraggableTask';

export const Model = ({ board }: any) => {
    const [tasks, setTasks] = useState<any>(board.tasks);

    const changePositionTask = (target: any, taskId: bigint) => {
        const cycleId = target.data?.cycleId;
        const position = target.data?.position;
        if (cycleId == null || position == null) return;

        setTasks((prev: any) =>
            prev.map((item: any) =>
                item.id === taskId
                    ? { ...item, cycleId: BigInt(cycleId), position: Number(position) }
                    : item
            )
        );
    };

    const [isOpen, setIsOpen] = useState(false);

    const [isEditColumnsOpen, setIsEditColumnsOpen] = useState(false);

    const selectedItem = useItemsStore((state) => state.selectedItem);

    const [cycleItem, setCycleItem] = useState<{ columns: []; title: string; id: any }>();

    // lấy thông in cycle
    const getCycley = (columns: any, title: string, id: any) => {
        setIsEditColumnsOpen(!isEditColumnsOpen);
        setCycleItem({ columns, title, id });
    };

    const addCycle = async () => {
        await addCycleBoard(board.id);
    };

    const taskQueue = tasks.filter((task: any) => task.cycleId === null);

    return (
        <div className="w-full h-full bg-gray-100 p-4 shadow">
            <DragDropProvider
                onDragEnd={(event) => {
                    const { source, target } = event.operation;

                    if (event.canceled || !source || !target) return;
                    changePositionTask(target, BigInt(source.id));
                }}
            >
                {/* Board header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold text-gray-800">{board.name}</h3>
                        <Image
                            src={infoIcon}
                            alt="Info"
                            width={18}
                            height={18}
                            className="cursor-pointer opacity-50"
                        />
                    </div>

                    {/* Add cycle */}
                    <div className="flex gap-10">
                        <button
                            onClick={addCycle}
                            className="flex items-center gap-2 rounded-md border-2 border-orange-200  px-3 py-2 shadow-sm transition hover:bg-green-400"
                        >
                            <span className="text-sm font-medium text-gray-700">Cycle</span>

                            <Image src={addIcon} alt="Add task" width={18} height={18} />
                        </button>
                    </div>
                </div>

                <div className="w-full flex gap-2 bg-white rounded-md shadow p-2 mt-5">
                    {/* Add task */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 rounded-md border-2 bg-green-300 border-gray-200 px-3 py-2 shadow-sm transition hover:bg-green-400"
                    >
                        <span className="text-sm font-medium text-gray-700">Task</span>

                        <Image src={addIcon} alt="Add task" width={18} height={18} />
                    </button>

                    {/* Task queue */}
                    <div className="w-full h-10 grid grid-cols-6 row-auto gap-2">
                        {taskQueue.map((task: any, index: number) => (
                            <DraggableTask key={task.id ?? index} task={task} />
                        ))}
                    </div>
                </div>

                {/* Create task */}
                {isOpen && (
                    <div className="mt-4">
                        <CreateTask
                            user={selectedItem?.user}
                            cycleInfor={cycleItem}
                            boardId={board.id}
                        />
                    </div>
                )}

                {/* Cycle */}
                <div className="mt-4 w-full space-y-4 bg-white shadow rounded-md">
                    {board.cycle?.map((cycle: any) => (
                        <div key={cycle.id} className="overflow-hidden">
                            {/* Cycle header */}
                            <div className="px-2 py-1 border-b-2 flex items-center gap-3 border-orange-300 ">
                                <h4 className="text-lg font-semibold text-gray-700/70 pt-2 pb-2">
                                    Cycle {cycle.title}
                                </h4>
                                <button
                                    onClick={() => getCycley(cycle.columns, cycle.title, cycle.id)}
                                >
                                    <img
                                        src="/pen.png"
                                        alt="Edit"
                                        className="cursor-pointer size-4.5 opacity-50"
                                    />
                                </button>
                            </div>

                            {/* Columns */}
                            <div
                                className="grid w-full"
                                style={{
                                    gridTemplateColumns: `repeat(${cycle.columns.length > 4 ? 4 : cycle.columns.length}, minmax(0, 1fr))`,
                                }}
                            >
                                {/* No columns */}
                                {cycle.columns.length === 0 ? (
                                    <p className="w-full text-sm text-center p-2 text-gray-500">
                                        No Columns
                                    </p>
                                ) : null}
                                {/* Has columns */}
                                {cycle.columns.map((item: any, index: number) => {
                                    const itemTasks = tasks.filter(
                                        (task: any) =>
                                            task.cycleId === cycle.id &&
                                            task.position === item.position
                                    );

                                    return (
                                        <div
                                            key={item?.position}
                                            className="min-w-0 min-h-40 border border-gray-200"
                                        >
                                            {/* Column title */}
                                            <div className="border-b border-gray-200 px-3 py-2">
                                                <div className="truncate text-sm font-medium text-gray-700 flex gap-2 items-center justify-center">
                                                    <p className="opacity-40">{index + 1}.</p>
                                                    <p>{item.name} </p>
                                                </div>
                                            </div>

                                            {/* Tasks */}
                                            <DroppableColumn
                                                key={item?.position}
                                                cycle={cycle}
                                                id={item.position}
                                                task={itemTasks}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit columns */}
                {isEditColumnsOpen && (
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
