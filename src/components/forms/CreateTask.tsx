import Image from 'next/image';

import addIcon from '@/public/add.png';
import { useState } from 'react';
import { createTask } from '@/src/server/actions/task.action';

type user = {
    id: string;
    name: string;
    image: string;
};

export const CreateTask = ({ user, board }: { user: any; board: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [User, setUser] = useState<user[]>([]);

    const handleSubmit = async (e: any) => {
        const userId = User.map((item: user) => item.id).join(',');
        e.preventDefault();
        const formData = new FormData(e.target);
        await createTask({
            task: {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                createdAt: new Date(formData.get('createdAt') as string),
                dueDate: new Date(formData.get('dueDate') as string),
                columnId: '0',
                boardId: BigInt(board),
            },
            assigneeds: [
                {
                    userId: userId.split(',') as string[],
                },
            ],
        });
    };

    return (
        <div className="w-full grid gap-y-5 border border-gray-300 rounded-md p-4">
            <div className="relative w-full flex gap-2">
                <div className="flex items-center w-[85%] p-1 gap-5 border border-gray-300 rounded-md">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 bg-amber-50 p-2"
                    >
                        <p className="text-sm opacity-70">Người Thực hiện</p>
                        <Image src={addIcon} alt="add" width={24} height={24} />
                    </button>
                    <div className="flex gap-2 w-[70%]">
                        {User.map((item: user) => (
                            <div key={item.id} className="flex items-center gap-2">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={30}
                                    height={30}
                                    className="rounded-full object-cover size-8"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className={
                        isOpen
                            ? 'absolute w-full top-full right-0 grid grid-cols-4 gap-2 bg-white p-2 shadow'
                            : 'hidden'
                    }
                >
                    {user.map((item: user) => (
                        <div
                            onClick={() => setUser([...User, item])}
                            key={item.id}
                            className="flex w-full gap-2 bg-white items-center hover:bg-gray-100 p-2"
                        >
                            <Image
                                src={item.image}
                                alt={item.name}
                                width={30}
                                height={30}
                                className="rounded-full object-cover size-8"
                            />
                            <div className=" p-2 rounded-md">{item.name}</div>
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="flex justify-between w-full ">
                    <input
                        name="title"
                        type="text"
                        placeholder="Tên công việc"
                        className="block w-1/3 border border-gray-300 rounded-md p-2"
                    />
                    <div className="flex gap-5 justify-center w-full">
                        <div className="flex w-[30%] justify-center items-center gap-2 border border-green-300 shadow rounded-full">
                            <label className="text-sm bg-green-400 text-white  p-2 w-1/3 h-full text-center content-center rounded-full">
                                Bắt đầu{' '}
                            </label>
                            <input
                                name="startDate"
                                type="date"
                                placeholder="Thời gian bắt đầu"
                                className="w-2/3 p-2 mr-2 outline-none"
                            />
                        </div>
                        <div className="flex w-[30%] justify-center items-center gap-2 border border-red-300 shadow rounded-full">
                            <label className="text-sm bg-red-400 text-white  p-2 w-1/3 h-full text-center content-center rounded-full">
                                kết thúc{' '}
                            </label>
                            <input
                                name="endDate"
                                type="date"
                                placeholder="Thời gian kết thúc"
                                className="w-2/3 p-2 mr-2 outline-none"
                            />
                        </div>
                    </div>
                    <input type="text" placeholder="Người Tạo" value={user.name} hidden />
                </div>
                <input
                    type="text"
                    placeholder="Ghi chú"
                    className="block w-full border border-gray-300 bg-gray-100 rounded-md p-2"
                />
                <div className="w-[15%] flex justify-end">
                    <button className="border-2 p-2 rounded-md text-green-500 bg-green-100 text-center">
                        Tạo công việc
                    </button>
                </div>
            </form>
        </div>
    );
};
