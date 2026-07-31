import { ErrorAlertComponent } from './../../../shared/components/error-alert/error-alert.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../services/company.service';
import { ITenant } from '../../models/tenant.model';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-company-profile',
  imports: [ReactiveFormsModule, JsonPipe, DatePipe, ErrorAlertComponent],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css',
})
export class CompanyProfileComponent implements OnInit {
  companyService = inject(CompanyService);
  notifyService = inject(NotifyService);
  authService = inject(AuthService);
  tenantData = signal<ITenant | null>(null);
  isModalOpen = signal(false); // لو شغال بـ Angular Signals

  tenantForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    subscriptionStatus: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getCompanyProfile();
  }

  openUpdateModal() {
    // تعبئة الفورم بالبيانات الحالية للـ Tenant عند الفتح
    this.isModalOpen.set(true);
    if (this.tenantData() !== null) {
      this.tenantForm.patchValue(this.tenantData()!);
    }
  }

  closeUpdateModal() {
    this.isModalOpen.set(false);
  }

  updateTenantData() {
    if (this.tenantForm.valid) {
      const data = this.tenantForm.value;
      this.companyService.updateCompany(data).subscribe({
        next: (res) => {
          this.notifyService.showSuccess(res?.message!);
          this.tenantData.set(res?.data?.tenant!);
          this.closeUpdateModal();
        },
        error: (error) => {
          this.notifyService.showError(error?.error?.message);
          this.closeUpdateModal();
        },
      });
    }
  }

  // get company profile
  getCompanyProfile() {
    this.companyService.getCompanyInfo().subscribe({
      next: (res) => {
        this.tenantData.set(res?.data?.tenant!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }
}
