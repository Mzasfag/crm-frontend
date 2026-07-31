import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { IUser } from '../models/user.model';
import { NotifyService } from '../services/notify.service';

export const authorizaionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const cookieService = inject(CookieService);
  const notifyService = inject(NotifyService);

  // 1. لو الكود شغال على السيرفر (SSR)، مرر الطلب وسيب المتصفح يفحصه بعد التحميل
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // 2. الفحص داخل المتصفح
  const hasToken = cookieService.check('token'); // check بترجع true أو false مباشرة
  const user: IUser = JSON.parse(cookieService.get('userData'));
  if (hasToken && user) {
    if (
      (hasToken && state?.url == '/dashboard' && user?.role.toLowerCase() == 'admin') ||
      (hasToken && state?.url == '/dashboard' && user?.role.toLowerCase() == 'manager') ||
      (hasToken && state?.url == '/dashboard' && user?.role.toLowerCase() == 'sales')
    ) {
      return true;
    } else if (
      (hasToken && state?.url == '/compaigns' && user?.role.toLowerCase() == 'admin') ||
      (hasToken && state?.url == '/compaigns' && user?.role.toLowerCase() == 'manager') ||
      (hasToken && state?.url == '/compaigns' && user?.role.toLowerCase() == 'sales')
    ) {
      return true;
    } else if (
      (hasToken && state?.url == '/customers' && user?.role.toLowerCase() == 'admin') ||
      (hasToken && state?.url == '/customers' && user?.role.toLowerCase() == 'manager') ||
      (hasToken && state?.url == '/customers' && user?.role.toLowerCase() == 'sales')
    ) {
      return true;
    } else if (
      (hasToken && state?.url == '/tasks' && user?.role.toLowerCase() == 'admin') ||
      (hasToken && state?.url == '/tasks' && user?.role.toLowerCase() == 'manager') ||
      (hasToken && state?.url == '/tasks' && user?.role.toLowerCase() == 'sales')
    ) {
      return true;
    } else if (
      (hasToken && state?.url == '/deals' && user?.role.toLowerCase() == 'admin') ||
      (hasToken && state?.url == '/deals' && user?.role.toLowerCase() == 'manager') ||
      (hasToken && state?.url == '/deals' && user?.role.toLowerCase() == 'sales')
    ) {
      return true;
    } else if (hasToken && state?.url == '/team' && user?.role.toLowerCase() == 'admin') {
      return true;
    } else if (
      hasToken &&
      state?.url == '/company-profile' &&
      user?.role.toLowerCase() == 'admin'
    ) {
      return true;
    } else {
      notifyService.showWarn('not authorized to access this page');
      return router.createUrlTree(['/not-authorized']);
    }
  }

  notifyService.showWarn('not authorized to access this page');
  return router.createUrlTree(['/not-authorized']);
};
