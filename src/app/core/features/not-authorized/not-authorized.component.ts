import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-authorized',
  imports: [RouterLink],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.css',
})
export class NotAuthorizedComponent {
  router = inject(Router);
  platform = inject(PLATFORM_ID);

  back() {
    if (isPlatformBrowser(this.platform)) {
      history.back();
    }
  }
}
