import { Component, effect, inject, input } from '@angular/core';
import { TodoService } from '../../Services/todo-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateTodoRequest } from '../../models/todo.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-edit-todo',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit-todo.html',
  styleUrl: './edit-todo.css',
})
export class EditTodo {
  /*constructor() {
    effect(() => {
      if (this.todoService.updateTodoStatus() === 'success') {
        this.todoService.updateTodoStatus.set('idle');
        this.router.navigate(['/Home/Todos']);
      }

      if (this.todoService.updateTodoStatus() === 'error') {
        this.todoService.updateTodoStatus.set('idle');
        console.error('Something went wrong!');
      }
    });
  }*/

  id = input<string>();
  private todoService = inject(TodoService);
  private router = inject(Router);

  todoResourceRef = this.todoService.getTodoById(this.id);
  todoResponse = this.todoResourceRef.value;

  editTodoFormGroup = new FormGroup({
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)],
    }),
  });

  get descriptionFormControl() {
    return this.editTodoFormGroup.controls.description;
  }

  effectRef = effect(() => {
    this.editTodoFormGroup.controls.description.patchValue(this.todoResponse()?.description ?? '');
  });

  onSubmit() {
    const id = this.id();
    if (!this.editTodoFormGroup.valid || !id) {
      return;
    }

    const formRawValue = this.editTodoFormGroup.getRawValue();

    const updateTodoRequestDto: UpdateTodoRequest = {
      description: formRawValue.description,
    };


    this.todoService.updateTodo(id, updateTodoRequestDto).subscribe({
      next: () => {
        this.todoService.updateTodoStatus.set("success");
        this.router.navigate(['/Todos'])
        console.log('update ok')
      },
      error: () => {
        this.todoService.updateTodoStatus.set('error');
      },
    });
  }

  deleteTodo() {
    const id = this.id();
    if (!id) {
      return;
    }

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.router.navigate(['/Todos']);
      },
      error: () => {
        console.error('Something went wrong!');
      },
    });
  }
}
