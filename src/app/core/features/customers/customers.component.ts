import { Component, inject, OnInit, signal } from '@angular/core';
import { AddCustomerFormComponent } from '../../../shared/components/add-customer-form/add-customer-form.component';
import { CustomerService } from '../../services/customer.service';
import { ICustomer } from '../../models/customer.model';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../../shared/pipes/search-pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NotifyService } from '../../services/notify.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customers',
  imports: [
    AddCustomerFormComponent,
    ConfirmDialogModule,
    FormsModule,
    CommonModule,
    SearchPipe,
    ToastModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  providers: [ConfirmationService, MessageService],
})
export class CustomersComponent implements OnInit {
  private customerService = inject(CustomerService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  authService = inject(AuthService);
  notifyService = inject(NotifyService);
  customerFormIsOpen = signal<boolean>(false);
  customerList = signal<ICustomer[] | null>(null);
  customerListCloned = signal<ICustomer[] | null>(null);
  selectedCustomerData = signal<ICustomer | null>(null);
  nevigateArr = signal<number[]>([0, 4]);
  stopNext = signal<boolean>(false);
  stopPrev = signal<boolean>(false);
  dropDownIsOpen = signal<string>('');
  currentCustomerId = '';
  searchTerm = '';
  statusTerm = '';

  activeDropdownId = signal<string | null>(null);

  toggleDropDown(customerId: string) {
    // لو العميل ده هو نفسه المفتوح حالياً، اقفله (خليه null)، لو عميل تاني افتحه
    this.activeDropdownId.update((currentId) => (currentId === customerId ? null : customerId));
  }

  // دالة مساعدة سريعة
  isDropdownOpen(customerId: string): boolean {
    return this.activeDropdownId() === customerId;
  }
  ngOnInit(): void {
    this.getAllCustomers();
  }

  toggleCustomerForm() {
    this.customerFormIsOpen.set(!this.customerFormIsOpen());
    localStorage.removeItem('selectedCustomerData');
  }

  handleCustomerForm(data: boolean) {
    this.customerFormIsOpen.set(data);
    this.getAllCustomers();
  }

  // get all customers
  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (res) => {
        this.customerList.set(res?.data?.customers!);
        this.customerListCloned.set(res?.data?.customers!);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  nextNeviagete() {
    const currentListLength = this.customerListCloned()?.length ?? 0;

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

  // on delete customer
  onDeleteCustomer(customerId: string) {
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

        this.customerService.deleteCustomer(customerId).subscribe({
          next: (res) => {
            this.notifyService.showSuccess(res?.message!);
            this.getAllCustomers();
            this.toggleDropDown(customerId);
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
        this.toggleDropDown(customerId);
        return;
      },
      key: 'positionDialog',
    });
  }

  // setToUpdate
  setToUpdate(data: ICustomer) {
    this.customerFormIsOpen.set(true);
    localStorage.setItem('selectedCustomerData', JSON.stringify(data));
  }
}
