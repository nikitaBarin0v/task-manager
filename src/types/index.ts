interface User {
  id: number
  name: string
  password: string
  email: string
}

interface Task {
  id: number
  taskName: string
  column: 'new' | 'in-progress' | 'done'
  userId: number
  description?: string 
}

export type {User, Task}