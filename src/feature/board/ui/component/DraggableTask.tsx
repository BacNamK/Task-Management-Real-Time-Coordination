import { useDraggable } from '@dnd-kit/react';
import { useState } from 'react';
import DetailTask from '../../../task/ui/component/DetailTask';
import { Target } from 'lucide-react';
import type { Task } from '../../../task/service/task.type';

function DraggableTask({ task }: { task: Task }) {
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
            className={`draggable-Task flex min-h-11 w-full items-center gap-2.5 rounded-xl border bg-white px-3 py-2 transition ${
                isDragging
                    ? 'cursor-grabbing border-indigo-300 opacity-60 shadow-md'
                    : 'cursor-grab border-slate-200 hover:border-indigo-200 hover:shadow-sm'
            }`}
        >
            <button
                type="button"
                aria-label={`View details for ${task.title}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => setShowTaskDetail((open) => !open)}
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
                <Target aria-hidden="true" size={16} />
            </button>
            <p className="min-w-0 truncate text-sm font-medium text-slate-700">{task.title}</p>
            {showTaskDetail && (
                <DetailTask task={task} close={() => setShowTaskDetail(!showTaskDetail)} />
            )}
        </div>
    );
}

export default DraggableTask;
