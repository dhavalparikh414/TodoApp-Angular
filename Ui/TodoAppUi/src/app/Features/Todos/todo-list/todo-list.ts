import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddTodoRequest } from '../models/todo.model';
import { TodoService } from '../Services/todo-service';
import { Router, RouterLink } from '@angular/router';


@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-todo-list',
  styleUrl: './todo-list.css',
  templateUrl: './todo-list.html',
})
export class TodoList {
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (this.todoService.addTodoStatus() === 'success') {
        this.todoService.addTodoStatus.set('idle');
        this.router.navigateByUrl('/Home');
      }

      if (this.todoService.addTodoStatus() === 'error') {
        console.error('Add Todo Request Failed');
      }
    });
  }

  private todoService = inject(TodoService);

  private getAllTodosRef = this.todoService.getAllTodos();

  isLoading = this.getAllTodosRef.isLoading;
  isError = this.getAllTodosRef.error;
  value = this.getAllTodosRef.value;

  addTodoFormGroup = new FormGroup({
    description: new FormControl<string>('Enter a Todo', { nonNullable: true, validators: [Validators.required] })
  });

  get descriptionFormControl() {
    return this.addTodoFormGroup.controls.description;
  }

  onSubmit() {
    console.log(this.addTodoFormGroup.getRawValue());
    const addTodoFormValue = this.addTodoFormGroup.getRawValue();

    const addTodoRequestDto: AddTodoRequest = {
      description: addTodoFormValue.description,
    };

    this.todoService.addTodo(addTodoRequestDto).subscribe({
      next: () => {
        this.addTodoFormGroup.reset();
        this.getAllTodosRef.reload(); // 🔑 re-fetches the list
      },
      error: (err) => console.error('Failed to add todo:', err),
    });;
  }

}
