import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { ITenant } from '../models/tenant.model';
import { IUser } from '../models/user.model';

@Service()
export class RegisterCompanyService {
private http = inject(HttpClient);
private baseUrl = environment.baseUrl;

// register company
registerCompany(data:any):Observable<IMainResposne<{tenant:ITenant,user:IUser[],token:string}>>{
return this.http.post<IMainResposne<{tenant:ITenant,user:IUser[],token:string}>>(`${this.baseUrl}/auth/register-company`,data)
}

}
