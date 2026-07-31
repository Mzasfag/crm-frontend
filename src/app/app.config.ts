import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { MessageService } from 'primeng/api';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { handleToken } from './core/interceptors/handle-token.interceptor';
import {CookieService} from 'ngx-cookie-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    CookieService,
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([loaderInterceptor,handleToken])),
    MessageService,
    providePrimeNG({
      license:
        'eyJpZCI6ImYwYzc0MmE2LWFhMWUtNGJlYS04NzNiLTNlOTA3ODNjMzM2MiIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODUwMjQwOTksImV4cCI6MTgxNjU2MDA5OX0.6RX1AMaXf5kW3ICxYpVGdG5Tgrm4f31JmFu3lLoS8VWeW2TbUOo64T6pb1BqjOvtwnk2Q5dMHfXWucNEGl1ZCA',
      theme: {
        preset: Lara,
      },
    }),
  ],
};
