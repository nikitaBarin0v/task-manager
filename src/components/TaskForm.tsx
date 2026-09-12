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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded p-6 w-96" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('taskName')} type="text" placeholder='Введите название задачи' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.taskName?.message && <span>{errors.taskName.message}</span>}

          <input {...register('description')} type='text' placeholder='Введите описание задачи' className="w-full border rounded p-2 mb-1 outline-none focus:border-blue-500" />
          {errors.description?.message && <span>{errors.description.message}</span>}

          <button type='submit' disabled={isSubmitting} className="w-full bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600 mt-2">{isSubmitting ? 'Отправляем...' : 'Отправить'}</button>
        </form>
      </div>
    </div>
  )

}