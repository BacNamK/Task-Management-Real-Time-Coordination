'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import addIcon from '@/public/add.png';
import infoIcon from '@/public/info-sign.png';
import settingIcon from '@/public/setting.png';

import { CreateTask } from '../../forms/CreateTask';
import { useItemsStore } from '@/src/hooks/workspaceHook';
import { getTask } from '@/src/server/actions/task.action';

export const Model = ({ board }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    const countColumns = board.columnsConfig.map((item: ColumnConfig) => item.item.length);
    const col = Number(countColumns[0]);

    // Lấy Object đang được lưu trong store ra sử dụng
    const selectedItem = useItemsStore((state) => state.selectedItem);
    const setSelectedItem = useItemsStore((state) => state.setSelectedItem);

    if (!selectedItem) return null;

    const handleClose = () => {
        setSelectedItem(null); // Xóa object trong store khi đóng
    };

    const [tasks, setTasks] = useState<any[]>([]);

    useEffect(() => {
        // 1. Define the async function inside the effect
        const fetchTasks = async () => {
            if (!board?.id) return;
            const res = await getTask(BigInt(board.id));
            setTasks(res);
        };

        // 2. Call it
        fetchTasks();
    }, [board?.id]); // 3. Add board.id to the dependency array

    return (
        <div className="w-full grid gap-y-4 h-auto bg-white p-4 rounded-md shadow border border-gray-300">
            <header className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                    <h3 className="text-xl font-semibold">{board.name}</h3>
                    <Image
                        src={infoIcon}
                        alt=""
                        width={18}
                        height={18}
                        className="opacity-50 cursor-pointer"
                    />
                </div>
                <div className="mr-5">
                    <Image
                        className=" cursor-pointer opacity-70"
                        src={settingIcon}
                        alt=""
                        width={20}
                        height={20}
                    />
                </div>
            </header>
            {/** Task */}
            <div className="w-fullrounded-md flex gap-2 justify-between items-center border border-gray-200 bg-gray-100 rounded-[5px] p-1">
                <div className="min-w-26 w-26 h-full bg-green-300 hover:bg-green-500 flex items-center shadow rounded-[5px] border-2 border-white">
                    <p className="text-md block text-gray-500 bg-white w-full h-full p-2 rounded-[5px]">
                        Task
                    </p>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full h-full justify-items-center flex items-center justify-center"
                    >
                        <Image src={addIcon} alt="" width={20} height={20} />
                    </button>
                </div>
                {/** Task display */}
                <div className="w-full h-full flex flex-wrap gap-2">
                    {tasks.map((item: any) => (
                        <div
                            key={item.id}
                            className="min-w-12 w-auto p-2 rounded-md border border-gray-300 bg-gray-100 flex items-center justify-center"
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
            {isOpen && <CreateTask user={selectedItem.user} board={board.id} />}
            <div className="w-full gap-2 grid gap-y-4">
                {board.columnsConfig.map((column: ColumnConfig, index: number) => (
                    <div key={column.id} className=" rounded-md border border-gray-200">
                        <h4 className="text-lg p-2">Tiến trình {index + 1}</h4>
                        <div
                            className="w-full grid bg-white rounded-xl shadow"
                            style={{
                                gridTemplateColumns: `repeat(${col}, minmax(0, 1fr))`,
                            }}
                        >
                            {column.item.map((item: ColumnItem) => (
                                <div key={item.id} className="w-full h-full rounded-2xl">
                                    <div className="w-full text-center p-1 border border-gray-300">
                                        {item.name}
                                    </div>
                                    <div className="w-full min-h-15 border border-gray-300 bg-gray-100"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
