'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import addIcon from '@/public/add.png';
import infoIcon from '@/public/info-sign.png';

import { CreateTask } from '../../forms/CreateTask';
import { useItemsStore } from '@/src/hooks/workspaceHook';
import EditColumnsBoard from '../../forms/EditColumnsBoard';

import { addCycleBoard } from '@/src/server/actions/board.action';

export const Model = ({ board }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const [isEditColumnsOpen, setIsEditColumnsOpen] = useState(false);

    const selectedItem = useItemsStore((state) => state.selectedItem);

    const [cycleItem, setCycleItem] = useState<{ columns: []; title: string; id: any }>();

    // lấy thông in cycle
    const getCycleycle = (columns: any, title: string, id: any) => {
        setIsEditColumnsOpen(!isEditColumnsOpen);
        setCycleItem({ columns, title, id });
    };

    const addCycle = async () => {
        await addCycleBoard(board.id);
    };

    useEffect(() => {}, [board.cycle]);

    const tasks = board.cycle;

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
                <div className="flex gap-10">
                    <button
                        onClick={addCycle}
                        className="flex items-center gap-2 rounded-md border-2 border-orange-200  px-3 py-2 shadow-sm transition hover:bg-green-400"
                    >
                        <span className="text-sm font-medium text-gray-700">Cycle</span>

                        <Image src={addIcon} alt="Add task" width={18} height={18} />
                    </button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 rounded-md border-2 bg-green-300 border-gray-200 px-3 py-2 shadow-sm transition hover:bg-green-400"
                    >
                        <span className="text-sm font-medium text-gray-700">Task</span>

                        <Image src={addIcon} alt="Add task" width={18} height={18} />
                    </button>
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

            {/* Board columns */}
            <div className="mt-4 w-full space-y-4">
                {(Array.isArray(board.cycle) ? board.cycle : []).map(
                    (cycle: any, cycleIndex: number) => (
                        <div key={cycle.id} className="overflow-hidden">
                            {/* Progress header */}
                            <div className="px-2 py-1 border-b-2 flex items-center gap-3 border-orange-300 ">
                                <h4 className="text-lg font-semibold text-gray-700/70">
                                    Cycle {cycle.title}
                                </h4>
                                <button
                                    onClick={() =>
                                        getCycleycle(cycle.columns, cycle.title, cycle.id)
                                    }
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
                                className="grid w-full row-auto gap-y-2"
                                style={{
                                    gridTemplateColumns: `repeat(${cycle.columns.length > 4 ? 4 : cycle.columns.length}, minmax(0, 1fr))`,
                                }}
                            >
                                {cycle.columns.length === 0 ? (
                                    <p className="w-full text-sm text-center p-2 text-gray-500">
                                        No Columns
                                    </p>
                                ) : null}
                                {cycle.columns.map((item: any) => {
                                    const itemTasks = tasks[cycleIndex].task.filter(
                                        (task: any) => task.position === item.position
                                    );

                                    return (
                                        <div
                                            key={item?.position}
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
                                                    <div
                                                        key={task.id ?? taskIndex}
                                                        className="w-full cursor-pointer rounded-[5px] border border-gray-200 bg-white p-2 text-sm shadow-sm transition hover:border-gray-300 hover:shadow"
                                                    >
                                                        {task.title}
                                                    </div>
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
                    cycle={cycleItem}
                    setIsEditColumnsOpen={setIsEditColumnsOpen}
                    boardId={board.id}
                />
            )}
        </div>
    );
};
