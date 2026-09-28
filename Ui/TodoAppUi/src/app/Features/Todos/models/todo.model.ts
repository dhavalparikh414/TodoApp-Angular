export interface AddTodoRequest {
  description: string;
}

export interface UpdateTodoRequest {
  description: string;
}

export interface Todo {
  id: string;
  description: string;
}