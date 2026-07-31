import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { ICustomer } from '../models/customer.model';

@Service()
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  // getAllCustomers
  getAllCustomers(): Observable<IMainResposne<{ customers: ICustomer[] }>> {
    return this.http.get<IMainResposne<{ customers: ICustomer[] }>>(`${this.baseUrl}/customers`);
  }

  // add Customer
  addCustomer(data: any): Observable<IMainResposne<ICustomer>> {
    return this.http.post<IMainResposne<ICustomer>>(`${this.baseUrl}/customers`, data);
  }
  // delete Customer
  deleteCustomer(customerId: string): Observable<IMainResposne<any>> {
    return this.http.delete<IMainResposne<any>>(`${this.baseUrl}/customers/${customerId}`);
  }
  // update Customer
  updateCustomer(data: any, customerId: string): Observable<IMainResposne<ICustomer>> {
    return this.http.patch<IMainResposne<ICustomer>>(
      `${this.baseUrl}/customers/${customerId}`,
      data,
    );
  }

  // getCustomerById
  getCustomerById(customerId: string): Observable<IMainResposne<ICustomer>> {
    return this.http.get<IMainResposne<ICustomer>>(`${this.baseUrl}/customers/${customerId}`);
  }
}
