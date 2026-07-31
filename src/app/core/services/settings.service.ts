import { Service, signal } from '@angular/core';

@Service()
export class SettingsService {
userSettings = signal<any>({});
}
