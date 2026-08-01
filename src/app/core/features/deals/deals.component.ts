import { Component, inject, OnInit, signal } from '@angular/core';
import { DealService } from '../../services/deal.service';
import { IDeal } from '../../models/deal.model';
import { FormsModule } from '@angular/forms';
import { SearchOnDealPipe } from '../../../shared/pipes/search-on-deal-pipe';
import { SettingsService } from '../../services/settings.service';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotifyService } from '../../services/notify.service';
import { AddDealFormComponent } from '../../../shared/components/add-deal-form/add-deal-form.component';
import { DashboardStatusService } from '../../services/dashboard-status.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deals',
  imports: [FormsModule, SearchOnDealPipe, ConfirmDialog, Toast, AddDealFormComponent],
  templateUrl: './deals.component.html',
  styleUrl: './deals.component.css',
  providers: [MessageService, ConfirmationService],
})
export class DealsComponent implements OnInit {
  private dealService = inject(DealService);
  dashboardService = inject(DashboardStatusService);
  authService = inject(AuthService);
  settingsService = inject(SettingsService);
  messageService = inject(MessageService);
  notifyService = inject(NotifyService);
  confirmationService = inject(ConfirmationService);
  dealList = signal<IDeal[] | null>(null);
  dealListCloned = signal<IDeal[] | null>(null);
  nevigateArr = signal<number[]>([0, 4]);
  stopNext = signal<boolean>(false);
  stopPrev = signal<boolean>(false);
  dealFormIsOpen = signal<boolean>(false);
  activeDropdownId = signal<string | null>(null);
  dropDownIsOpen = signal<string>('');
  searchTerm = '';
  stageTerm = '';

  ngOnInit(): void {
    this.getAllDeals();
  }

  getAllDeals() {
    this.dealService.getAllDeals().subscribe({
      next: (res) => {
        this.dealListCloned.set(res?.data?.deals!);
        this.dealList.set(res?.data?.deals!);
        console.log(res?.data?.deals!);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  nextNeviagete() {
    const currentListLength = this.dealListCloned()?.length ?? 0;

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

  isDropdownOpen(customerId: string): boolean {
    return this.activeDropdownId() === customerId;
  }
  toggleDropDown(customerId: string) {
    // لو العميل ده هو نفسه المفتوح حالياً، اقفله (خليه null)، لو عميل تاني افتحه
    this.activeDropdownId.update((currentId) => (currentId === customerId ? null : customerId));
  }

  setToUpdate(deal: IDeal) {
    this.dealFormIsOpen.set(true);
    localStorage.setItem(
      'selectedDealData',
      JSON.stringify({
        value: deal?.value,
        title: deal?.title,
        customerId: deal?.customerId?._id,
        assignedTo: deal?.assignedTo?._id,
        stage: deal?.stage,
        _id: deal?._id,
      }),
    );
  }
  // on delete customer
  onDeleteDeal(dealId: string) {
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

        this.dealService.deleteDeal(dealId).subscribe({
          next: (res) => {
            this.notifyService.showSuccess(res?.message!);
            this.getAllDeals();
            this.toggleDropDown(dealId);
            this.dashboardService.getDashboardStats();
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
        this.toggleDropDown(dealId);
        return;
      },
      key: 'positionDialog',
    });
  }

  handleDealForm(data: boolean) {
  this.getAllDeals();
    this.dealFormIsOpen.set(data);
  }
}
