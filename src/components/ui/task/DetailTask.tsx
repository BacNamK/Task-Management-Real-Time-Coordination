import { useState } from 'react';
import Image from 'next/image';

const DetailTask = ({ task, close }: { task: any; close: () => void }) => {
    const [taskDetail, setTaskDetail] = useState<any>(task);
    return (
        <div className="absolute z-20 top-0 left-0 w-full h-full bg-black/20 shadow backdrop-blur-md flex items-center justify-center">
            <main className="relative w-2/3 h-auto bg-white rounded-md flex flex-col p-6 gap-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-2xl opacity-70">{taskDetail.title}</p>
                    <button onClick={() => close()} className="w-6 h-6 text-red-500">
                        x
                    </button>
                </div>
                <div className="flex w-full h-full">
                    <div className="w-1/2 p-2">
                        <p className="text-sm">
                            {taskDetail.description ? taskDetail.description : 'No description'}
                        </p>
                    </div>
                    <div className="w-1/2 flex flex-col gap-y-2 border-l-2 border-gray-300 p-2">
                        {/* Date */}
                        <div className="bg-gray-100 border-2 border-gray-100 rounded-md text-sm flex justify-between">
                            <div className="flex w-auto justify-between gap-4 p-2">
                                <span>{taskDetail.createdAt.toLocaleDateString()}</span>
                                <span>-&gt;</span>
                                <span>
                                    {taskDetail.dueDate?.toLocaleDateString() || 'No due date'}
                                </span>
                            </div>
                            <div className="w-auto bg-white content-center p-2">
                                {taskDetail.createdAt &&
                                taskDetail.createdAt &&
                                taskDetail.dueDate ? (
                                    <span>
                                        {Math.ceil(
                                            (new Date(taskDetail.dueDate).getTime() -
                                                new Date(taskDetail.createdAt).getTime()) /
                                                (1000 * 60 * 60 * 24)
                                        )}{' '}
                                        days left
                                    </span>
                                ) : (
                                    '- day left'
                                )}
                            </div>
                        </div>
                        {/* Assignee */}
                        <div className="flex justify-between items-center p-2">
                            <span>Assigneed:</span>
                            {taskDetail.assigneeds.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <Image
                                        src={item.user?.image || ''}
                                        alt={item.user?.name || ''}
                                        width={28}
                                        height={28}
                                        className="rounded-full"
                                    />
                                    <p>{item.user?.name || 'No assignee'}</p>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex justify-end">
                            <button className="w-24 bg-green-400 shadow rounded-md p-4 py-2 text-white">
                                Enter
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DetailTask;
