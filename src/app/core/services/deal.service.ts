import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { IDeal } from '../models/deal.model';

@Service()
export class DealService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  // getAllDeals
  getAllDeals(): Observable<IMainResposne<{ deals: IDeal[] }>> {
    return this.http.get<IMainResposne<{ deals: IDeal[] }>>(`${this.baseUrl}/deals`);
  }

  // add deal
  addDeal(data: any): Observable<IMainResposne<IDeal>> {
    return this.http.post<IMainResposne<IDeal>>(`${this.baseUrl}/deals`, data);
  }
  // delete deal
  deleteDeal(dealId: string): Observable<IMainResposne<any>> {
    return this.http.delete<IMainResposne<any>>(`${this.baseUrl}/deals/${dealId}`);
  }
  // update deal
  updateDeal(data: any, dealId: string): Observable<IMainResposne<IDeal>> {
    return this.http.patch<IMainResposne<IDeal>>(`${this.baseUrl}/deals/${dealId}`, data);
  }

  // getDealById
  getDealById(dealId: string): Observable<IMainResposne<IDeal>> {
    return this.http.get<IMainResposne<IDeal>>(`${this.baseUrl}/deals/${dealId}`);
  }
}
