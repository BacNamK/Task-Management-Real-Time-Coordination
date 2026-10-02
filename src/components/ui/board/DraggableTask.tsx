import { useDraggable } from '@dnd-kit/react';
import Image from 'next/image';
import detailIcon from '@/public/side-menu.png';
import { useState } from 'react';
import DetailTask from '../task/DetailTask';

function DraggableTask({ task }: { task: any }) {
    const [showTaskDetail, setShowTaskDetail] = useState(false);

    const { ref, isDragging } = useDraggable({
        id: task.id,
        data: {
            taskId: task.id,
        },
        disabled: showTaskDetail,
    });
    return (
        <div
            ref={ref}
            className={`flex gap-2 w-full min-h-10 cursor-grab rounded-[5px] border border-gray-400 bg-white p-2 content-center transition hover:shadow ${
                isDragging ? '' : ''
            }`}
        >
            <Image
                src={detailIcon}
                alt="Task Icon"
                width={20}
                height={20}
                className="scale-75"
                onClick={() => setShowTaskDetail(!showTaskDetail)}
            />
            <p className="text-sm text-gray-700 truncate">{task.title}</p>
            {showTaskDetail && (
                <DetailTask task={task} close={() => setShowTaskDetail(!showTaskDetail)} />
            )}
        </div>
    );
}

export default DraggableTask;
