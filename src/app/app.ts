import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services/auth.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from './core/services/settings.service';
import { CookieService } from 'ngx-cookie-service';
import { NotifyService } from './core/services/notify.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('brandos');
  private authService = inject(AuthService);
  private platfromId = inject(PLATFORM_ID);
  private settingsService = inject(SettingsService);
  private cookieService = inject(CookieService);
  private notifyService = inject(NotifyService);
  ngOnInit(): void {
    if (isPlatformBrowser(this.platfromId)) {
      const tokenFromCookie = this.cookieService.get('token');
      const userDataFromCookie = this.cookieService.get('userData');
      const userSettings = localStorage.getItem('userSettings');
      if (userSettings !== undefined) {
        this.settingsService.userSettings.set(JSON.parse(userSettings!));
      }
      if (tokenFromCookie.length == 0) {
        // no token
        this.notifyService.showWarn('You Are Not Authentication To Go This Url');

        this.authService.token.set(null);
      } else {
        // exist token
        this.authService.token.set(tokenFromCookie);
      }

      if (userDataFromCookie.length == 0) {
        // no user data
        this.authService.userData.set(undefined);
      } else {
        // exist user data
        this.authService.userData.set(JSON.parse(userDataFromCookie));
      }
    }
  }
}
