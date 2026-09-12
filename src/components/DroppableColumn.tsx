
import { useDroppable } from "@dnd-kit/core";
import type React from "react";


export function DroppableColumn({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded p-4 w-80 min-h-96">
      <h3 className="font-bold text-lg mb-4 text-gray-700">{title}</h3>
      {children}
    </div>
  )
}