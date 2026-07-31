import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const cookieService = inject(CookieService);

  // 1. لو الكود شغال على السيرفر (SSR)، مرر الطلب وسيب المتصفح يفحصه بعد التحميل
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // 2. الفحص داخل المتصفح
  const hasToken = cookieService.check('token'); // check بترجع true أو false مباشرة
  
  if (hasToken) {
    return true;
  }

  // 3. لو مفيش توكن، وجه المستخدم لصفحة اللوجين
  return router.createUrlTree(['/not-authorized']);
};
