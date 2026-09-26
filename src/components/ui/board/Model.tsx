'use client';

import Image from 'next/image';
import { useState } from 'react';

import addIcon from '@/public/add.png';
import infoIcon from '@/public/info-sign.png';

import { CreateTask } from '../../forms/CreateTask';
import { useItemsStore } from '@/src/hooks/workspaceHook';
import EditColumnsBoard from '../../forms/EditColumnsBoard';

export const Model = ({ board }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const [isEditColumnsOpen, setIsEditColumnsOpen] = useState(false);

    const tasks = Object.values(board.task ?? {}).flat();

    const selectedItem = useItemsStore((state) => state.selectedItem);

    return (
        <div className="w-full h-auto bg-white p-4 shadow">
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

                {/* Add task */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-green-300 px-3 py-2 shadow-sm transition hover:bg-green-400"
                >
                    <span className="text-sm font-medium text-gray-700">Task</span>

                    <Image src={addIcon} alt="Add task" width={18} height={18} />
                </button>
            </div>

            {/* Create task */}
            {isOpen && (
                <div className="mt-4">
                    <CreateTask user={selectedItem?.user} board={board.id} />
                </div>
            )}

            {/* Board columns */}
            <div className="mt-4 w-full space-y-4">
                {(Array.isArray(board.columnsConfig) ? board.columnsConfig : []).map(
                    (column: ColumnConfig) => (
                        <div key={column.id} className="overflow-hidden">
                            {/* Progress header */}
                            <div className="px-2 py-1 border-b-2 flex items-center gap-3 border-orange-300 ">
                                <h4 className="text-lg font-semibold text-gray-700/70">
                                    Cycle {column.name}
                                </h4>
                                <button onClick={() => setIsEditColumnsOpen(!isEditColumnsOpen)}>
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
                                    gridTemplateColumns: `repeat(${column.item.length}, minmax(0, 1fr))`,
                                }}
                            >
                                {column.item.map((item: ColumnItem) => {
                                    const itemTasks = tasks.filter(
                                        (task: any) => task.columnId === item.id
                                    );

                                    return (
                                        <div
                                            key={item.id}
                                            className="min-w-0 border border-gray-200"
                                        >
                                            {/* Column title */}
                                            <div className="border-b border-gray-200 px-3 py-2">
                                                <div className="truncate text-sm font-medium text-gray-700 text-center">
                                                    {item.name}
                                                </div>
                                            </div>

                                            {/* Tasks */}
                                            <div className="min-h-16 bg-gray-100/70 p-2">
                                                {itemTasks.map((task: any, taskIndex: number) => (
                                                    <span
                                                        key={task.id ?? taskIndex}
                                                        className="w-full cursor-pointer rounded-md border border-gray-200 bg-white p-2 m-1 text-sm shadow-sm transition hover:border-gray-300 hover:shadow"
                                                    >
                                                        {task.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                )}
            </div>

            {/* Edit columns */}
            {isEditColumnsOpen && (
                <EditColumnsBoard
                    columns={board.columnsConfig}
                    setIsEditColumnsOpen={setIsEditColumnsOpen}
                    boardId={board.id}
                />
            )}
        </div>
    );
};
