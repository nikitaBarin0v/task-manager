import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types";

export function DraggableTask({ task, onDelete }: { task: Task, onDelete: () => void }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.id });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {task.taskName}
      <button onClick={onDelete}>Удалить</button>
    </div>
  )
}