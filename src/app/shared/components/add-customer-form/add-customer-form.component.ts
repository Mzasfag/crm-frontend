import { Component, inject, input, OnInit, output, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { CustomerService } from '../../../core/services/customer.service';
import { NotifyService } from '../../../core/services/notify.service';
import { ICustomer } from '../../../core/models/customer.model';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-customer-form',
  imports: [ReactiveFormsModule, ErrorAlertComponent],
  templateUrl: './add-customer-form.component.html',
  styleUrl: './add-customer-form.component.css',
})
export class AddCustomerFormComponent implements OnInit {
  handleCustomerFormIsOpen = output<boolean>();
  private customerService = inject(CustomerService);
  private notifyService = inject(NotifyService);
  selectedCustomerUpdate = signal<ICustomer | null>(null);
  private platformId = inject(PLATFORM_ID);
  customerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const selectedCustomerDataUpated = localStorage.getItem('selectedCustomerData');
      if (selectedCustomerDataUpated !== undefined) {
        this.customerForm.patchValue(JSON.parse(selectedCustomerDataUpated!));
        this.selectedCustomerUpdate.set(JSON.parse(selectedCustomerDataUpated!));
      }
    }
  }

  // nameController
  get nameController() {
    return this.customerForm.get('name');
  }

  // emailController
  get emailController() {
    return this.customerForm.get('email');
  }

  // phoneController
  get phoneController() {
    return this.customerForm.get('phone');
  }

  // companyNameController
  get companyNameController() {
    return this.customerForm.get('companyName');
  }

  // statusController
  get statusController() {
    return this.customerForm.get('status');
  }

  closeCustomerForm() {
    this.handleCustomerFormIsOpen.emit(false);
    localStorage.removeItem('selectedCustomerData');
  }

  // on add customer
  addCustomer() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.customerForm.value;
    this.customerService.addCustomer(data).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        this.customerForm.reset();
        this.closeCustomerForm();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeCustomerForm();
      },
    });
  }

  // on update customer
  onUpdateCustomer() {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.customerForm.value;
    this.customerService.updateCustomer(data, this.selectedCustomerUpdate()?._id!).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        localStorage.removeItem('selectedCustomerData');
        this.closeCustomerForm();
        this.customerForm.reset();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeCustomerForm();
        this.customerForm.reset();
      },
    });
  }
}
