import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { isPlatformBrowser } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  userSettings = new FormGroup({
    currency: new FormControl(''),
    country: new FormControl(''),
  });
  isLoading = signal<boolean>(false);
  private notifyService = inject(NotifyService);
  private settingsSerive = inject(SettingsService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userSettings = localStorage.getItem('userSettings');
      this.userSettings.patchValue(JSON.parse(userSettings!));
    }
  }

  saveSettings() {
    this.isLoading.set(true);
    const data = this.userSettings.value;
    localStorage.setItem('userSettings', JSON.stringify(data));
    setTimeout(() => {
      this.isLoading.set(false);
      this.notifyService.showSuccess('Settings Updated');
      this.settingsSerive.userSettings.set(data!);
    }, 1000);
  }
}
