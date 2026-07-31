import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const handleToken: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const cookieService = inject(CookieService);
  if (isPlatformBrowser(platformId)) {
    const tokenFromCookie = cookieService.get("token");

    // نتحقق إنه مش null ولا string فاضي
    if (tokenFromCookie) {
      const cloned = req.clone({
        setHeaders: {
          // تأكد هل الباك إند بيطلب الهيدر اسمه token ولا Authorization: Bearer ...؟
          Authorization: `Bearer ${tokenFromCookie}`,
        },
      });

      return next(cloned);
    }
  }

  return next(req);
};
