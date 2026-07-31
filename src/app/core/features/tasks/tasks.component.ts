import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardStatusService } from '../../services/dashboard-status.service';
import { IDashboardStatus } from '../../models/dashboard-status.model';
import { TaskService } from '../../services/task.service';
import { ITask } from '../../models/task.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchOnTaskPipe } from '../../../shared/pipes/search-on-task-pipe';
import { TaskModelComponent } from '../../../shared/components/task-model/task-model.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotifyService } from '../../services/notify.service';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  imports: [
    DatePipe,
    FormsModule,
    SearchOnTaskPipe,
    TaskModelComponent,
    ConfirmDialogModule,
    Toast,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  providers: [MessageService, ConfirmationService],
})
export class TasksComponent implements OnInit {
  dashboardStatusService = inject(DashboardStatusService);
  taskService = inject(TaskService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  notifyService = inject(NotifyService);
  authService = inject(AuthService);
  dashboardStats = signal<IDashboardStatus | null>(null);
  taskList = signal<ITask[] | null>(null);
  taskListCloned = signal<ITask[] | null>(null);
  activeDropdownId = signal<string | null>(null);
  taskFormIsOpen = signal<boolean>(false);
  searchTerm = '';
  statusTerm = '';
  priorityTerm = '';
  stopNext = signal<boolean>(false);
  stopPrev = signal<boolean>(false);
  selectedTaskData = signal<ITask | null>(null);
  nevigateArr = signal<number[]>([0, 4]);

  ngOnInit(): void {
    this.dashboardStatusService.getDashboardStats();
    this.getAllTasks();
  }

  getAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (res) => {
        this.taskList.set(res?.data?.tasks!);
        this.taskListCloned.set(res?.data?.tasks!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  toggleTaskForm() {
    this.taskFormIsOpen.set(!this.taskFormIsOpen());
    localStorage.removeItem('selectedTaskData');
  }
  toggleDropDown(taskId: string) {
    // لو العميل ده هو نفسه المفتوح حالياً، اقفله (خليه null)، لو عميل تاني افتحه
    this.activeDropdownId.update((currentId) => (currentId === taskId ? null : taskId));
  }

  // دالة مساعدة سريعة
  isDropdownOpen(taskId: string): boolean {
    return this.activeDropdownId() === taskId;
  }

  nextNeviagete() {
    const currentListLength = this.taskListCloned()?.length ?? 0;

    this.nevigateArr.update(([start, end]) => {
      const nextStart = end;
      const nextEnd = end + 4;

      // لو الـ start الجديد عدى طول اللستة، نرجع زي ما كنا ونوقف الزرار
      if (nextStart >= currentListLength) {
        this.stopNext.set(true);
        return [start, end]; // محصلش تغيير
      }

      this.stopPrev.set(false); // طالما اتحركنا قدام يبقى الـ prev اشتغل

      // لو الـ end الجديد عدى اللستة، نخلي الـ end آخره طول اللستة
      const finalEnd = nextEnd > currentListLength ? currentListLength : nextEnd;

      // لو وصلنا للنهاية، نقفل الـ next
      if (finalEnd === currentListLength) {
        this.stopNext.set(true);
      }

      return [nextStart, finalEnd];
    });
  }

  prevNeviagete() {
    this.nevigateArr.update(([start, end]) => {
      const prevStart = start - 4;
      const prevEnd = start; // الـ end القديم بيبقى هو الـ start الجديد

      // لو الـ start الجديد بقى أقل من أو يساوي 0
      if (prevStart <= 0) {
        this.stopPrev.set(true);
        this.stopNext.set(false);
        return [0, 4]; // نرجع للبداية خالص
      }

      this.stopNext.set(false); // طالما رجعنا لورا يبقى الـ next متاح
      return [prevStart, prevEnd];
    });
  }

  handleTaskForm(data: boolean) {
    this.taskFormIsOpen.set(data);
    this.getAllTasks();
  }

  // setToUpdate
  setToUpdate(data: ITask) {
    this.taskFormIsOpen.set(true);
    localStorage.setItem('selectedTaskData', JSON.stringify(data));
  }

  // on delete task
  onDeleteTask(taskId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Request submitted',
        });

        this.taskService.deleteTask(taskId).subscribe({
          next: (res) => {
            this.notifyService.showSuccess(res?.message!);
            this.getAllTasks();
            this.toggleDropDown(taskId);
            this.dashboardStatusService.getDashboardStats();
          },
          error: (error) => {
            this.notifyService.showError(error?.error?.message);
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Process incomplete',
          life: 3000,
        });
        this.toggleDropDown(taskId);
        return;
      },
      key: 'positionDialog',
    });
  }
}
