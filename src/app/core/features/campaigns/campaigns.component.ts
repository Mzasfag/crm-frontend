import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardStatusService } from '../../services/dashboard-status.service';
import { SettingsService } from '../../services/settings.service';
import { CampaignService } from '../../services/campaign.service';
import { ICampaign } from '../../models/campaign.model';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignModelComponent } from '../../../shared/components/campaign-model/campaign-model.component';
import { SearchOnCampaignPipe } from '../../../shared/pipes/search-on-campaign-pipe';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-compaigns',
  imports: [
    DatePipe,
    FormsModule,
    CampaignModelComponent,
    SearchOnCampaignPipe,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.css',
  providers: [MessageService, ConfirmationService],
})
export class CompaignsComponent implements OnInit {
  dashboardService = inject(DashboardStatusService);
  settingsService = inject(SettingsService);
  private campaignService = inject(CampaignService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  authService = inject(AuthService);
  notifyService = inject(NotifyService);
  campaignList = signal<ICampaign[] | null>(null);
  campaignListCloned = signal<ICampaign[] | null>(null);
  settingService = inject(SettingsService);
  stopNext = signal<boolean>(false);
  stopPrev = signal<boolean>(false);
  nevigateArr = signal<number[]>([0, 4]);
  statusTerm = '';
  channelTerm = '';
  activeDropdownId = signal<string | null>(null);
  campaignFormIsOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.dashboardService.getDashboardStats();
    this.getAllCampaigns();
  }

  toggleCampaignForm() {
    this.campaignFormIsOpen.set(!this.campaignFormIsOpen());
    localStorage.removeItem('selectedCampaignData');
    this.dashboardService.getDashboardStats();
  }

  toggleDropDown(campaignId: string) {
    // لو العميل ده هو نفسه المفتوح حالياً، اقفله (خليه null)، لو عميل تاني افتحه
    this.activeDropdownId.update((currentId) => (currentId === campaignId ? null : campaignId));
  }

  // دالة مساعدة سريعة
  isDropdownOpen(campaignId: string): boolean {
    return this.activeDropdownId() === campaignId;
  }

  // get all campaigns
  getAllCampaigns() {
    this.campaignService.getAllCampaigns().subscribe({
      next: (res) => {
        this.campaignList.set(res?.data?.campaigns!);
        this.campaignListCloned.set(res?.data?.campaigns!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  nextNeviagete() {
    const currentListLength = this.campaignListCloned()?.length ?? 0;

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

  // setToUpdate
  setToUpdate(data: ICampaign) {
    this.campaignFormIsOpen.set(true);
    localStorage.setItem('selectedCampaignData', JSON.stringify(data));
  }

  // onDeleteCampaign
  onDeleteCampaign(campaignId: string) {
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

        this.campaignService.deleteCampaign(campaignId).subscribe({
          next: (res) => {
            this.notifyService.showSuccess(res?.message!);
            this.dashboardService.getDashboardStats();
            this.getAllCampaigns();
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
        this.toggleDropDown(campaignId);
        return;
      },
      key: 'positionDialog',
    });
  }

  // handleCampaignForm
  handleCampaignForm(data: boolean) {
    this.campaignFormIsOpen.set(data);
    this.dashboardService.getDashboardStats();
    this.getAllCampaigns();
  }
}
