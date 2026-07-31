import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ErrorAlertComponent } from '../../../shared/components/error-alert/error-alert.component';
import { NotifyService } from '../../services/notify.service';
import { LoaderService } from '../../services/loader.service';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MessageModule, ErrorAlertComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private notifyService = inject(NotifyService);
  private loaderService = inject(LoaderService);
  private cookieService = inject(CookieService);
  private userSettingService = inject(SettingsService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  isLoading = signal<boolean>(false);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  get passwordController() {
    return this.loginForm?.get('password');
  }

  get emailController() {
    return this.loginForm?.get('email');
  }

  ngOnInit(): void {
    this.loaderService.toggleLoader();
    if (isPlatformBrowser(this.platformId)) {
      const latestExistAccountInCookie = this.cookieService.get('userData');
      if (latestExistAccountInCookie.length !== 0) {
        this.passwordController?.setValue(JSON.parse(latestExistAccountInCookie).password!);
        this.emailController?.setValue(JSON.parse(latestExistAccountInCookie).email!);
      }
    }
  }

  onLogin() {
    this.isLoading.set(true);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loginData = this.loginForm.value;

    // call api
    this.authService.login(loginData).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        this.cookieService.set('token', res?.data?.token!);
        this.cookieService.set('userData', JSON.stringify(res?.data?.user));
        const userSettings = {
          currency: 'EGP',
          country: 'EG',
        };
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
        this.userSettingService.userSettings.set(userSettings);
        this.authService.userData.set(res?.data?.user);
        this.authService.token.set(res?.data?.token!);
        this.isLoading.set(false);
        if (
          res?.data?.user?.role.toLowerCase() == 'admin' ||
          res?.data?.user?.role.toLowerCase() == 'manager' ||
          res?.data?.user?.role.toLowerCase() == 'sales'
        ) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/compaigns');
        }
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.isLoading.set(false);
      },
    });
  }
}
