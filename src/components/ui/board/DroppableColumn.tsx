import { useDroppable } from '@dnd-kit/react';
import DraggableTask from './DraggableTask';

function DroppableColumn({ cycle, id, task }: { cycle: any; id: string; task: any }) {
    const { ref, isDropTarget } = useDroppable({
        id: `${cycle.id}-${id}`,
        data: {
            cycleId: cycle.id,
            position: id,
        },
    });

    return (
        <div ref={ref} className={`min-h-40 p-2 flex flex-col gap-1 `}>
            {task.map((item: any) => (
                <DraggableTask key={item.id} task={item} />
            ))}
        </div>
    );
}

export default DroppableColumn;
