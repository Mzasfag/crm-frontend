import { Component, inject, output, PLATFORM_ID, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { NotifyService } from '../../../core/services/notify.service';
import { ITask } from '../../../core/models/task.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { CustomerService } from '../../../core/services/customer.service';
import { UserService } from '../../../core/services/user.service';
import { IUser } from '../../../core/models/user.model';
import { ICustomer } from '../../../core/models/customer.model';
import { DealService } from '../../../core/services/deal.service';
import { IDeal } from '../../../core/models/deal.model';
import { DashboardStatusService } from '../../../core/services/dashboard-status.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-model',
  imports: [ErrorAlertComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './task-model.component.html',
  styleUrl: './task-model.component.css',
})
export class TaskModelComponent {
  handletaskFormIsOpen = output<boolean>();
  private taskService = inject(TaskService);
  private notifyService = inject(NotifyService);
  private dashboardService = inject(DashboardStatusService);
  customerService = inject(CustomerService);
  userService = inject(UserService);
  dealService = inject(DealService);
  private platformId = inject(PLATFORM_ID);
  selectedTaskUpdate = signal<ITask | null>(null);
  userList = signal<IUser[] | null>(null);
  customerList = signal<ICustomer[] | null>(null);
  dealList = signal<IDeal[] | null>(null);
  authService = inject(AuthService);
  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    assignedTo: new FormControl('', [Validators.required]),
    customerId: new FormControl('', [Validators.required]),
    dealId: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const selectedTaskData = localStorage.getItem('selectedTaskData');

      if (selectedTaskData && selectedTaskData !== 'undefined') {
        const parsedData = JSON.parse(selectedTaskData);

        // بنظبط حقول التواريخ لو موجودة عشان تناسب الـ input type="date"
        if (parsedData.dueDate) {
          parsedData.dueDate = parsedData.dueDate.split('T')[0];
        }
        parsedData.customerId = parsedData?.customerId?._id!;
        parsedData.assignedTo = parsedData?.assignedTo?._id!;
        parsedData.dealId = parsedData?.dealId?._id!;
        // نعمل patchValue بالداتا بعد التعديل
        this.taskForm.patchValue(parsedData!);
        this.selectedTaskUpdate.set(parsedData);
      }
    }

    this.getAllCustomers();
    this.getAllDeals();
    if (this.authService?.userData()?.role.toLowerCase() == 'admin') {
      this.getAllUsers();
    } else {
      this.getAllUsersDropDown();
    }
  }

  // titleController
  get titleController() {
    return this.taskForm.get('title');
  }

  // priorityController
  get priorityController() {
    return this.taskForm.get('priority');
  }

  // phoneController
  get assignedToController() {
    return this.taskForm.get('assignedTo');
  }

  // customerIdController
  get customerIdController() {
    return this.taskForm.get('customerId');
  }

  // statusController
  get statusController() {
    return this.taskForm.get('status');
  }
  // dealIdController
  get dealIdController() {
    return this.taskForm.get('dealId');
  }
  // dueDateController
  get dueDateController() {
    return this.taskForm.get('dueDate');
  }
  // descriptionController
  get descriptionController() {
    return this.taskForm.get('description');
  }

  // on update task
  onUpdateTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.taskForm.value;
    this.taskService.updateTask(data, this.selectedTaskUpdate()?._id!).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        localStorage.removeItem('selectedTaskData');
        this.dashboardService.getDashboardStats();
        this.closeTaskForm();
        this.taskForm.reset();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeTaskForm();
        this.taskForm.reset();
      },
    });
  }

  // on add task
  addTask() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.taskForm.value;
    this.taskService.addTask(data).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        this.dashboardService.getDashboardStats();
        this.closeTaskForm();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeTaskForm();
      },
    });
  }

  closeTaskForm() {
    this.handletaskFormIsOpen.emit(false);
    this.taskForm.reset();
    localStorage.removeItem('selectedTaskData');
  }

  // getAllCustomers
  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (res) => {
        this.customerList.set(res?.data?.customers!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  // getAllUsers
  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.userList.set(res?.data?.users!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }
  // getAllUsersDropDown
  getAllUsersDropDown() {
    this.userService.getAllUsersDropDown().subscribe({
      next: (res) => {
        this.userList.set(res?.data?.users!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  getAllDeals() {
    this.dealService.getAllDeals().subscribe({
      next: (res) => {
        this.dealList.set(res?.data?.deals!);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
