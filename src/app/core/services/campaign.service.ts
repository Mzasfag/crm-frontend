import { ICampaign } from './../models/campaign.model';
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IMainResposne } from '../models/main-response.model';

@Service()
export class CampaignService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  // getAllcampaigns
  getAllCampaigns(): Observable<IMainResposne<{ campaigns: ICampaign[] }>> {
    return this.http.get<IMainResposne<{ campaigns: ICampaign[] }>>(`${this.baseUrl}/campaigns`);
  }

  // add campaign
  addCampaign(data: any): Observable<IMainResposne<ICampaign>> {
    return this.http.post<IMainResposne<ICampaign>>(`${this.baseUrl}/campaigns`, data);
  }
  // delete campaign
  deleteCampaign(campaignId: string): Observable<IMainResposne<any>> {
    return this.http.delete<IMainResposne<any>>(`${this.baseUrl}/campaigns/${campaignId}`);
  }
  // update campaign
  updateCampaign(data: any, campaignId: string): Observable<IMainResposne<ICampaign>> {
    return this.http.patch<IMainResposne<ICampaign>>(
      `${this.baseUrl}/campaigns/${campaignId}`,
      data,
    );
  }

  // getcampaignById
  getCampaignById(campaignId: string): Observable<IMainResposne<ICampaign>> {
    return this.http.get<IMainResposne<ICampaign>>(`${this.baseUrl}/campaigns/${campaignId}`);
  }
}
