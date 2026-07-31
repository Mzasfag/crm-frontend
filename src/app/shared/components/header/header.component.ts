import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardStatusService } from '../../../core/services/dashboard-status.service';
import { SettingsService } from '../../../core/services/settings.service';
import { AddDealFormComponent } from '../add-deal-form/add-deal-form.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AddDealFormComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private router = inject(Router);
  authService = inject(AuthService);
  dashboardService = inject(DashboardStatusService);
  settingsService = inject(SettingsService);
  dealFormIsOpen = signal<boolean>(false);

  onLogOut() {
    this.authService.clearToken();
    this.router.navigateByUrl('/login');
  }

  toggleDealForm() {
    this.dealFormIsOpen.set(!this.dealFormIsOpen());
    localStorage.removeItem('selectedDealData');
  }

  setDealFormStatus(data: boolean) {
    this.dealFormIsOpen.set(data);
  }
}
