import { Service, signal } from '@angular/core';

@Service()
export class LoaderService {
  isLoading = signal<boolean>(false);

  showLoader() {
    this.isLoading.set(true);
  }

  hideLoader() {
    this.isLoading.set(false);
  }

  toggleLoader() {
    this.showLoader();
    setTimeout(() => {
      this.hideLoader();
    }, 2000);
  }
}
