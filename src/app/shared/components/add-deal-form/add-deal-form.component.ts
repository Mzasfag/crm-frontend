import { Component, inject, OnInit, output, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotifyService } from '../../../core/services/notify.service';
import { DealService } from '../../../core/services/deal.service';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { ICustomer } from '../../../core/models/customer.model';
import { IUser } from '../../../core/models/user.model';
import { CustomerService } from '../../../core/services/customer.service';
import { UserService } from '../../../core/services/user.service';
import { DashboardStatusService } from '../../../core/services/dashboard-status.service';
import { isPlatformBrowser } from '@angular/common';
import { IDeal } from '../../../core/models/deal.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-add-deal-form',
  imports: [ReactiveFormsModule, ErrorAlertComponent],
  templateUrl: './add-deal-form.component.html',
  styleUrl: './add-deal-form.component.css',
})
export class AddDealFormComponent implements OnInit {
  private notifyService = inject(NotifyService);
  private dealService = inject(DealService);
  private cusomerService = inject(CustomerService);
  private userService = inject(UserService);
  authService = inject(AuthService);
  handleDealFormIsOpen = output<boolean>();
  customersList = signal<ICustomer[] | null>(null);
  usersList = signal<IUser[] | null>(null);
  selectedDealUpdate = signal<IDeal | null>(null);
  platformId = inject(PLATFORM_ID);
  private dashboardService = inject(DashboardStatusService);
  dealForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required, Validators.min(1)]),
    customerId: new FormControl('', [Validators.required]),
    assignedTo: new FormControl('', [Validators.required]),
  });

  updateDealForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required, Validators.min(1)]),
    customerId: new FormControl('', [Validators.required]),
    assignedTo: new FormControl('', [Validators.required]),
    stage: new FormControl(''),
  });

  ngOnInit(): void {
    this.getAllCustomers();
    if (this.authService?.userData()?.role.toLowerCase() == 'admin') {
      this.getAllUsers();
    } else {
      this.getAllUsersDropDown();
    }
    if (isPlatformBrowser(this.platformId)) {
      const selectedDealDataUpated = localStorage.getItem('selectedDealData');
      if (selectedDealDataUpated !== undefined) {
        this.selectedDealUpdate.set(JSON.parse(selectedDealDataUpated!));
        this.updateDealForm.patchValue(JSON.parse(selectedDealDataUpated!));
      }
    }
  }

  // titleController
  get titleController() {
    return this.dealForm.get('title');
  }

  // nameController
  get nameController() {
    return this.dealForm.get('name');
  }

  // valueController
  get valueController() {
    return this.dealForm.get('value');
  }

  // customerIdController
  get customerIdController() {
    return this.dealForm.get('customerId');
  }

  // assignedToController
  get assignedToController() {
    return this.dealForm.get('assignedTo');
  }
  // stageController
  get stageController() {
    return this.dealForm.get('stage');
  }

  // getAllCustomers
  getAllCustomers() {
    this.cusomerService.getAllCustomers().subscribe({
      next: (res) => {
        this.customersList.set(res?.data?.customers!);
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
        this.usersList.set(res?.data?.users!);
      },
      error: (error) => {
        this.notifyService.showError(error?.message);
      },
    });
  }

  // getAllUsersDropDown
  getAllUsersDropDown() {
    this.userService.getAllUsersDropDown().subscribe({
      next: (res) => {
        this.usersList.set(res?.data?.users!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  // onAddDeal
  onAddDeal() {
    if (this.dealForm.invalid) {
      this.dealForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }
    // call api
    const data = this.dealForm.value;
    this.dealService.addDeal(data).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        this.closeDealForm();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeDealForm();
      },
    });
  }

  // on update
  onUpdateDeal() {
    if (this.updateDealForm.invalid) {
      this.updateDealForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.updateDealForm.value;
    this.dealService.updateDeal(data, this.selectedDealUpdate()?._id!).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        localStorage.removeItem('selectedDealData');
        this.closeDealForm();
        this.dealForm.reset();
        this.dashboardService.getDashboardStats();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeDealForm();
        this.dealForm.reset();
      },
    });
  }

  closeDealForm() {
    this.handleDealFormIsOpen.emit(false);
    localStorage.removeItem('selectedDealData');
    this.dashboardService.getDashboardStats();
  }
}
