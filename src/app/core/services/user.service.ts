import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { IUser } from '../models/user.model';

@Service()
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  // getAllUsers
  getAllUsers(): Observable<IMainResposne<{ users: IUser[] }>> {
    return this.http.get<IMainResposne<{ users: IUser[] }>>(`${this.baseUrl}/users`);
  }
  // getAllUsers
  getAllUsersDropDown(): Observable<IMainResposne<{ users: IUser[] }>> {
    return this.http.get<IMainResposne<{ users: IUser[] }>>(`${this.baseUrl}/users/dropdown`);
  }

  // add User
  addUser(data: any): Observable<IMainResposne<IUser>> {
    return this.http.post<IMainResposne<IUser>>(`${this.baseUrl}/users`, data);
  }
  // delete User
  deleteUser(userId: string): Observable<IMainResposne<any>> {
    return this.http.delete<IMainResposne<any>>(`${this.baseUrl}/users/${userId}`);
  }
  // update User
  updateUser(data: any, userId: string): Observable<IMainResposne<IUser>> {
    return this.http.patch<IMainResposne<IUser>>(`${this.baseUrl}/users/${userId}`, data);
  }

  // getUserById
  getUserById(userId: string): Observable<IMainResposne<IUser>> {
    return this.http.get<IMainResposne<IUser>>(`${this.baseUrl}/users/${userId}`);
  }
}
