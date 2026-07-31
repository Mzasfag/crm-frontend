import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-my-tasks',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css',
})
export class MyTasksComponent implements OnInit {
  isStatusModalOpen = signal(false);
  selectedTaskId: string | null = null;
  taskService = inject(TaskService);
  notifyService = inject(NotifyService);
  authService = inject(AuthService);
  cookieService = inject(CookieService);
  platformId = inject(PLATFORM_ID);
  myTasks = signal<any[]>([]); // هاتملى من الـ API GET /api/v1/tasks
  statusForm = new FormGroup({
    status: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getMyTasks();
  }

  openStatusModal(task: any) {
    this.selectedTaskId = task._id;
    this.statusForm.patchValue({
      status: task.status,
    });
    this.isStatusModalOpen.set(true);
  }

  closeStatusModal() {
    this.isStatusModalOpen.set(false);
    this.selectedTaskId = null;
  }

  getTasksCountByStatus(status: string): number {
    return this.myTasks().filter((task) => task.status === status).length;
  }

  updateTaskStatus() {
    if (this.statusForm.valid && this.selectedTaskId) {
      const data = this.statusForm.value;
      this.taskService.UpdateMyTasks(this.selectedTaskId!, data).subscribe({
        next: (res) => {
          this.notifyService.showSuccess(res?.message!);
          this.getMyTasks();
          this.closeStatusModal();
        },
        error: (error) => {
          this.notifyService.showError(error?.error?.message);
          this.closeStatusModal();
        },
      });
    }
  }

  getMyTasks() {
    let userId;
    if (isPlatformBrowser(this.platformId)) {
      userId = JSON.parse(this.cookieService.get('userData'))?.id;
      console.log(userId);
    }
    this.taskService.getMyTasks(userId).subscribe({
      next: (res) => {
        this.myTasks.set(res?.data?.tasks!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message!);
      },
    });
  }
}
