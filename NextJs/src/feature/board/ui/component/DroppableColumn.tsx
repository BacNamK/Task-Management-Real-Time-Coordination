import { useDroppable } from '@dnd-kit/react';
import DraggableTask from './DraggableTask';
import type { Cycle } from '../../service/board.type';
import type { Task } from '../../../task/service/task.type';

function DroppableColumn({
    cycle,
    id,
    task,
}: {
    cycle: Cycle;
    id: string;
    task: Task[];
}) {
    const { ref, isDropTarget } = useDroppable({
        id: `${cycle.id}-${id}`,
        data: {
            cycleId: cycle.id,
            position: id,
        },
    });

    return (
        <div
            ref={ref}
            className={`droppableColumn-Board flex min-h-40 flex-col gap-2 p-3 transition-colors ${
                isDropTarget ? 'bg-indigo-50/70' : 'bg-white'
            }`}
        >
            {task.map((item) => (
                <DraggableTask key={item.id} task={item} />
            ))}
        </div>
    );
}

export default DroppableColumn;
