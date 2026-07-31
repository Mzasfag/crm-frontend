import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { IMainResposne } from '../models/main-response.model';
import { IDashboardStatus } from '../models/dashboard-status.model';

@Service()
export class DashboardStatusService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  dashboardStatus = signal<IDashboardStatus | null>(null);

  // get dashboard status
  getDashboardStats() {
    this.http.get<IMainResposne<IDashboardStatus>>(`${this.baseUrl}/dashboard/stats`).subscribe({
      next: (res) => {
        this.dashboardStatus.set(res?.data!);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
