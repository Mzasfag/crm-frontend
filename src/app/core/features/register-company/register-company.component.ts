import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorAlertComponent } from '../../../shared/components/error-alert/error-alert.component';
import { RegisterCompanyService } from '../../services/register-company.service';
import { NotifyService } from '../../services/notify.service';
import { CookieService } from 'ngx-cookie-service';

declare var lucide: {
  createIcons: () => void;
};
@Component({
  selector: 'app-register-company',
  imports: [RouterLink, ReactiveFormsModule, ErrorAlertComponent],
  templateUrl: './register-company.component.html',
  styleUrl: './register-company.component.css',
})
export class RegisterCompanyComponent implements OnInit {
  private loaderService = inject(LoaderService);
  private registerService = inject(RegisterCompanyService);
  private notifyService = inject(NotifyService);
  private router = inject(Router);
  cookieService = inject(CookieService);
  isLoading = signal<boolean>(false);
  successPage = signal<boolean>(false);
  creditionalCopied = signal<boolean>(false);
  registerCompanyForm = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    industry: new FormControl('', [Validators.required]),
    adminName: new FormControl('', [Validators.required]),
    adminEmail: new FormControl('', [Validators.required, Validators.email]),
    adminPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  ngOnInit(): void {
    this.loaderService.toggleLoader();
  }

  ngAfterViewInit(): void {
    // السطر ده هو اللي بيحول الـ <i> العادية لأيقونات SVG حقيقية بعد ما الصفحة تحمل
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  get companyNameController() {
    return this.registerCompanyForm.get('companyName');
  }
  get industryController() {
    return this.registerCompanyForm.get('industry');
  }
  get adminNameController() {
    return this.registerCompanyForm.get('adminName');
  }
  get adminEmailController() {
    return this.registerCompanyForm.get('adminEmail');
  }
  get adminPasswordController() {
    return this.registerCompanyForm.get('adminPassword');
  }

  // on register company fn
  onRegisterCompany() {
    this.isLoading.set(true);
    if (this.registerCompanyForm.invalid) {
      this.registerCompanyForm.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.registerCompanyForm.value;
    this.registerService.registerCompany(data).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);

        const adminAccount = {
          ...res?.data?.user[0],
          email: this.adminEmailController?.value,
          password: this.adminPasswordController?.value,
        };
        this.cookieService.set('userData', JSON.stringify(adminAccount));
        this.successPage.set(true);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  // copyclipboard fn
  copyClipboard() {
    const textToCopy = `Company: ${this.companyNameController?.value}\nAdmin Email: ${this.adminEmailController?.value}\nTemporary Password: ${this.adminPasswordController?.value}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      this.notifyService.showSuccess('Credentials copied to clipboard');
    });
  }
}
