
import { useDroppable } from "@dnd-kit/core";
import type React from "react";


export function DroppableColumn({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef}>
      <h3>{title}</h3>
      {children}
    </div>
  )
}