import { Routes } from '@angular/router';
import { TodoList } from './Features/Todos/todo-list/todo-list';
import { EditTodo } from './Features/Todos/edit-todo/edit-todo/edit-todo';

export const routes: Routes = [
  {
    path: 'Todos',
    component: TodoList
  },
  {
    path: 'Todos/edit/:id',
    component: EditTodo
  },

];
