import { inject, Service } from '@angular/core';
import { MessageService } from 'primeng/api';

@Service()
export class NotifyService {
  private messageService = inject(MessageService);
  showInfo(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Heads up',
      detail: message,
    });
  }
  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Saved successfully',
      detail: message,
    });
  }
  showWarn(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Check this',
      detail: message,
    });
  }
  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Something went wrong',
      detail: message,
    });
  }
  showSecondary(message: string) {
    this.messageService.add({
      severity: 'secondary',
      summary: 'For your information',
      detail: message,
    });
  }
  showContrast(message: string) {
    this.messageService.add({
      severity: 'contrast',
      summary: 'High contrast',
      detail: message,
    });
  }
}
