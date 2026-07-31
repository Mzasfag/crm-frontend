import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { ILoginResponse } from '../models/login-response.model';
import { IMyCustomUser, IUser } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  token = signal<string | null>(null);
  userData = signal<IUser | IMyCustomUser | undefined>(undefined);
  private cookieService = inject(CookieService);

  //   login fn
  login(data: any): Observable<IMainResposne<ILoginResponse>> {
    return this.http.post<IMainResposne<ILoginResponse>>(`${this.baseUrl}/auth/login`, data);
  }

  clearToken() {
    this.token.set(null);
    this.userData.set(undefined);
    this.cookieService.delete('userData');
    this.cookieService.delete('token');
  }

  get isLogged() {
    return !!this.token();
  }
}
