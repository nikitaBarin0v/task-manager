import { useSelector } from "react-redux";
import z from "zod";
import { useCreateTaskMutation } from "../store/api/tasksApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RootState } from "../store/store";

const taskFormSchema = z.object({
  taskName: z
    .string()
    .min(1, 'Введите название задачи'),
  description: z
    .string()
    .min(1, 'Введите описание')
    .optional()
})

type TaskFormData = z.infer<typeof taskFormSchema>;

export function TaskForm({ column, onClose }: { column: 'new' | 'in-progress' | 'done', onClose: () => void }) {

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const { register, handleSubmit, formState: {
    errors, isSubmitting
  } } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema)
  })

  async function onSubmit(data: TaskFormData) {
    await createTask({ ...data, column, userId: userId! });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('taskName')} type="text" placeholder='Введите название задачи' />
      {errors.taskName?.message && <span>{errors.taskName.message}</span>}

      <input {...register('description')} type='text' placeholder='Введите описание задачи' />
      {errors.description?.message && <span>{errors.description.message}</span>}

      <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Отправляем...' : 'Отправить'}</button>
    </form>
  )

}