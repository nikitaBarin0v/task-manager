import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task } from "../../types";

const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], number>({
      query: (userId) => ({
        url: '/tasks',
        params: { userId }
      })
    }),
    createTask: builder.mutation<Task, { taskName: string, column: 'new' | 'in-progress' | 'done', description?: string }>({
      query: (arg) => ({
        url: '/tasks',
        method: 'POST',
        body: arg
      })
    }),
    deleteTask: builder.mutation<Task, number> ({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE'
      })
    }),
    updateTask: builder.mutation<Task, { id: number, column: 'new' | 'in-progress' | 'done' }>({
      query: ({id, column}) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: { column }
      })
    })
  })
})

export default taskApi;
export const { useGetTasksQuery, useCreateTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } = taskApi;