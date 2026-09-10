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

  return (
    <>
      <h2>Dashboard</h2>
      <div>
        <div>{user?.name}</div>
        <button onClick={handleLogout}>Выйти</button>
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <DroppableColumn id='new' title='Новый'>
          <ul>
            {newTasks?.map(task => (
              <DraggableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)}></DraggableTask>
            ))}
          </ul>
          <button onClick={() => setActiveColumn('new')}>Добавить задачу</button>
        </DroppableColumn>

        <DroppableColumn id='in-progress' title='В процессе'>
          <ul>
            {inProgressTasks?.map(task => (
              <DraggableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)}></DraggableTask>
            ))}
          </ul>
          <button onClick={() => setActiveColumn('in-progress')}>Добавить задачу</button>
        </DroppableColumn>

        <DroppableColumn id='done' title='Выполнено'>
          <ul>
            {doneTasks?.map(task => (
              <DraggableTask key={task.id} task={task} onDelete={() => deleteTask(task.id)}></DraggableTask>
            ))}
          </ul>
          <button onClick={() => setActiveColumn('done')}>Добавить задачу</button>
        </DroppableColumn>

        {activeColumn && (
          <TaskForm column={activeColumn} onClose={() => setActiveColumn(null)} />
        )}
      </DndContext>
    </>
  )
}