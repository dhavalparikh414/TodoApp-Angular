import { HttpClient, httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { Injectable, inject, InputSignal, signal } from '@angular/core';
import { AddTodoRequest, UpdateTodoRequest, Todo } from '../models/todo.model';
import { Observable } from 'rxjs';

@Service()
export class TodoService {
  private http = inject(HttpClient);
  private apiBaseUrl = 'https://localhost:7003';

  addTodoStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');
  updateTodoStatus = signal<'idle' | 'loading' | 'error' | 'success'>('idle');

  addTodo(todo: AddTodoRequest) {
    this.addTodoStatus.set('loading');
    return this.http.post<void>(`${this.apiBaseUrl}/api/Todos`, todo);
  }

  getAllTodos() {
    return httpResource<Todo[]>(() => `${this.apiBaseUrl}/api/todos`);
  }

  getTodoById(id: InputSignal<string | undefined>) {
    return httpResource<Todo>(() => `${this.apiBaseUrl}/api/todos/${id()}`);
  }

  updateTodo(id: string, updateTodoRequestDto: UpdateTodoRequest) {
    this.updateTodoStatus.set('loading');

    return this.http
      .put<void>(`${this.apiBaseUrl}/api/todos/${id}`, updateTodoRequestDto);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/todos/${id}`, {
      withCredentials: true,
    });
  }
}
