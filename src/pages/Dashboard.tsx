import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store";
import { useDeleteTaskMutation, useGetTasksQuery } from "../store/api/tasksApi";
import { useState } from "react";
import { TaskForm } from "../components/TaskForm";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

export function Dashboard() {

  const dataTasks = useSelector((state: RootState) => state.auth.user?.id);
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: tasks, isLoading } = useGetTasksQuery(dataTasks!);

  const newTasks = tasks?.filter(task => task.column === 'new');
  const inProgressTasks = tasks?.filter(task => task.column === 'in-progress');
  const doneTasks = tasks?.filter(task => task.column === 'done');

  const [activeColumn, setActiveColumn] = useState<'new' | 'in-progress' | 'done' | null>(null)

  const [deleteTask] = useDeleteTaskMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate('/login');
  }

  console.log(user)

  return (
    <>
      <h2>Dashboard</h2>
      <div>
        <div>{user?.name}</div>
        <button onClick={handleLogout}>Выйти</button>
      </div>
      <div>
        <div>
          <h3>Новые</h3>
          <ul>
            {newTasks?.map(task => (
              <li key={task.id}>{task.taskName} <button onClick={() => deleteTask(task.id)}>Удалить</button></li>
            ))}
          </ul>
          <button onClick={() => setActiveColumn('new')}>Добавить задачу</button>
        </div>

        <div>
          <h3>В работе</h3>
          <ul>
            {inProgressTasks?.map(task => (
              <li key={task.id}>{task.taskName} <button onClick={() => deleteTask(task.id)}>Удалить</button></li>
            ))}
          </ul>
          <button onClick={() => setActiveColumn('in-progress')}>Добавить задачу</button>
        </div>

        <div>
          <h3>Выполненые</h3>
          <ul>
            {doneTasks?.map(task => (
              <li key={task.id}>{task.taskName} <button onClick={() => deleteTask(task.id)}>Удалить</button></li>
            ))}
          </ul>
          <button onClick={() => setActiveColumn('done')}>Добавить задачу</button>
        </div>

        {activeColumn && (
          <TaskForm column={activeColumn} onClose={() => setActiveColumn(null)} />
        )}
      </div>
    </>
  )
}