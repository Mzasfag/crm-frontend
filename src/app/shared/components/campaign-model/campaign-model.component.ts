import { Component, inject, output, PLATFORM_ID, signal } from '@angular/core';
import { CampaignService } from '../../../core/services/campaign.service';
import { NotifyService } from '../../../core/services/notify.service';
import { ICampaign } from '../../../core/models/campaign.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { start } from 'repl';

@Component({
  selector: 'app-campaign-model',
  imports: [ReactiveFormsModule, ErrorAlertComponent],
  templateUrl: './campaign-model.component.html',
  styleUrl: './campaign-model.component.css',
})

/*
  {
     "name": "Summer Paid Ads Campaign",
     "channel": "Paid Ads",
     "status": "Active",
     "budget": 50000,
     "startDate": "2026-08-01",
     "endDate": "2026-08-31"
   }
*/
export class CampaignModelComponent {
  handleCampaignFormIsOpen = output<boolean>();
  private CampaignService = inject(CampaignService);
  private notifyService = inject(NotifyService);
  selectedCampaignUpdate = signal<ICampaign | null>(null);
  private platformId = inject(PLATFORM_ID);
  campaignForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      channel: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      budget: new FormControl('', [Validators.required, Validators.min(1)]),
    },
    [this.checkOnDate],
  );

  checkOnDate(group: AbstractControl) {
    const startDate = new Date(group.get('startDate')?.value);
    const endDate = new Date(group.get('endDate')?.value);
    const currentDate = new Date();
    if (startDate < currentDate && startDate > endDate) {
      return {
        $startDate_error: true,
        $endDate_error: true,
      };
    } else if (startDate > endDate && startDate < currentDate) {
      return {
        $startDate_error: true,
        $endDate_error: true,
      };
    } else if (startDate > currentDate && endDate < startDate) {
      return {
        $endDate_error: true,
      };
    } else if (startDate < currentDate && endDate < currentDate) {
      return {
        $startDate_error: true,
        $endDate_error: true,
      };
    } else if (startDate < currentDate && endDate > currentDate) {
      return {
        $startDate_error: true,
      };
    } else {
      return {
        $startDate_error: false,
        $endDate_error: false,
      };
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const selectedCampaignDataUpdated = localStorage.getItem('selectedCampaignData');

      if (selectedCampaignDataUpdated && selectedCampaignDataUpdated !== 'undefined') {
        const parsedData = JSON.parse(selectedCampaignDataUpdated);

        // بنظبط حقول التواريخ لو موجودة عشان تناسب الـ input type="date"
        if (parsedData.startDate) {
          parsedData.startDate = parsedData.startDate.split('T')[0];
        }
        if (parsedData.endDate) {
          parsedData.endDate = parsedData.endDate.split('T')[0];
        }

        // نعمل patchValue بالداتا بعد التعديل
        this.campaignForm.patchValue(parsedData);
        this.selectedCampaignUpdate.set(parsedData);
      }
    }
  }

  // nameController
  get nameController() {
    return this.campaignForm.get('name');
  }

  // channelController
  get channelController() {
    return this.campaignForm.get('channel');
  }

  // startDateController
  get startDateController() {
    return this.campaignForm.get('startDate');
  }

  // endDateController
  get endDateController() {
    return this.campaignForm.get('endDate');
  }
  // budgetController
  get budgetController() {
    return this.campaignForm.get('budget');
  }

  // statusController
  get statusController() {
    return this.campaignForm.get('status');
  }

  closeCampaignForm() {
    this.handleCampaignFormIsOpen.emit(false);
    localStorage.removeItem('selectedCampaignData');
    this.campaignForm.reset();
  }

  // on add Campaign
  addCampaign() {
    if (
      this.campaignForm.errors?.['$endDate_error'] == true &&
      this.campaignForm.invalid &&
      this.campaignForm.errors?.['$startDate_error'] == true
    ) {
      this.campaignForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.campaignForm.value;
    this.CampaignService.addCampaign(data).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        this.closeCampaignForm();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeCampaignForm();
      },
    });
  }

  // on update Campaign
  onUpdateCampaign() {
    if (
      this.campaignForm.errors?.['$endDate_error'] == true &&
      this.campaignForm.invalid &&
      this.campaignForm.errors?.['$startDate_error'] == true
    ) {
      this.campaignForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.campaignForm.value;
    this.CampaignService.updateCampaign(data, this.selectedCampaignUpdate()?._id!).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        localStorage.removeItem('selectedCampaignData');
        this.closeCampaignForm();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeCampaignForm();
      },
    });
  }
}
