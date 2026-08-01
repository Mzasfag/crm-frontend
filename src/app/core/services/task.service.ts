import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';
import { ITask } from '../models/task.model';

@Service()
export class TaskService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  // getAlltasks
  getAllTasks(): Observable<IMainResposne<{ tasks: ITask[] }>> {
    return this.http.get<IMainResposne<{ tasks: ITask[] }>>(`${this.baseUrl}/tasks`);
  }

  // getMyTasks
  getMyTasks(userId: string): Observable<IMainResposne<{ tasks: ITask[] }>> {
    return this.http.get<IMainResposne<{ tasks: ITask[] }>>(
      `${this.baseUrl}/tasks?assignedTo=${userId}`,
    );
  }

  // UpdateMyTasks
  UpdateMyTasks(taskId: string, data: any): Observable<IMainResposne<{ tasks: ITask[] }>> {
    return this.http.patch<IMainResposne<{ tasks: ITask[] }>>(
      `${this.baseUrl}/tasks/${taskId}/status`,
      data,
    );
  }

  // add Task
  addTask(data: any): Observable<IMainResposne<ITask>> {
    return this.http.post<IMainResposne<ITask>>(`${this.baseUrl}/tasks`, data);
  }
  // delete Task
  deleteTask(TaskId: string): Observable<IMainResposne<any>> {
    return this.http.delete<IMainResposne<any>>(`${this.baseUrl}/tasks/${TaskId}`);
  }
  // update Task
  updateTask(data: any, TaskId: string): Observable<IMainResposne<ITask>> {
    return this.http.patch<IMainResposne<ITask>>(`${this.baseUrl}/tasks/${TaskId}`, data);
  }

  // getTaskById
  getTaskById(TaskId: string): Observable<IMainResposne<ITask>> {
    return this.http.get<IMainResposne<ITask>>(`${this.baseUrl}/tasks/${TaskId}`);
  }
}
