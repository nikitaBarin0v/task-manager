import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store";
import { useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskMutation } from "../store/api/tasksApi";
import { useState } from "react";
import { TaskForm } from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { DroppableColumn } from "../components/DroppableColumn";
import { DraggableTask } from "../components/DraggableTask";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

export function Dashboard() {

  const dataTasks = useSelector((state: RootState) => state.auth.user?.id);
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: tasks, isLoading } = useGetTasksQuery(dataTasks!);

  const newTasks = tasks?.filter(task => task.column === 'new');
  const inProgressTasks = tasks?.filter(task => task.column === 'in-progress');
  const doneTasks = tasks?.filter(task => task.column === 'done');

  const [activeColumn, setActiveColumn] = useState<'new' | 'in-progress' | 'done' | null>(null)

  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return

    updateTask({
      id: Number(active.id),
      column: over.id as 'new' | 'in-progress' | 'done'
    })
  }

  if (isLoading) return <div className="p-4">Загрузка...</div>

  return (
    <>
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div>{user?.name}</div>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>Выйти</button>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4">
          <DroppableColumn id='new' title='Новый'>
            <ul>
              {newTasks?.map(task => (
                <DraggableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)}></DraggableTask>
              ))}
            </ul>
            <button onClick={() => setActiveColumn('new')} className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">+ Добавить задачу</button>
          </DroppableColumn>

          <DroppableColumn id='in-progress' title='В процессе'>
            <ul>
              {inProgressTasks?.map(task => (
                <DraggableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)}></DraggableTask>
              ))}
            </ul>
            <button onClick={() => setActiveColumn('in-progress')} className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">+ Добавить задачу</button>
          </DroppableColumn>

          <DroppableColumn id='done' title='Выполнено'>
            <ul>
              {doneTasks?.map(task => (
                <DraggableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)}></DraggableTask>
              ))}
            </ul>
            <button onClick={() => setActiveColumn('done')} className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">+ Добавить задачу</button>
          </DroppableColumn>
        </div>

        {activeColumn && (
          <TaskForm column={activeColumn} onClose={() => setActiveColumn(null)} />
        )}
      </DndContext>
    </>
  )
}