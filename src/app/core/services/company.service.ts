import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { ITenant } from '../models/tenant.model';

@Service()
export class CompanyService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  // get company info
  getCompanyInfo(): Observable<IMainResposne<{ tenant: ITenant }>> {
    return this.http.get<IMainResposne<{ tenant: ITenant }>>(`${this.baseUrl}/tenants/me`);
  }

  // update company
  updateCompany(data: any): Observable<IMainResposne<{ tenant: ITenant }>> {
    return this.http.patch<IMainResposne<{ tenant: ITenant }>>(`${this.baseUrl}/tenants/me`, data);
  }
}
