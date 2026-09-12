import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types";

export function DraggableTask({ task, onDelete }: { task: Task, onDelete: () => void }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: task.id });

  return (
    <div ref={setNodeRef} {...attributes} className="bg-white rounded p-3 mb-2 shadow cursor-grab flex justify-between items-center">
      <span {...listeners} className="cursor-grab flex-1">{task.taskName}</span>
      <button onClick={(e) => {
        e.stopPropagation()
        onDelete()
      }} className="bg-red-400 text-white px-2 py-1 rounded text-sm">Удалить</button>
    </div>
  )
}