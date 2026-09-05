import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { User } from "../../types";

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  endpoints: (builder) => ({
    login: builder.query<User[], { email: string, password: string }>({
      query: (arg) => ({
        url: '/users',
        params: { email: arg.email, password: arg.password }
      })
    }),
    register: builder.mutation<User, {name: string, email: string, password: string}>({
      query: (arg) => ({
        url: '/users',
        method: 'POST',
        body: arg
      })
    })
  })
})

export default authApi;
export const { useLoginQuery, useRegisterMutation } = authApi;