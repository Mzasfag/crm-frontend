import { Pipe, PipeTransform } from '@angular/core';
import { ICampaign } from '../../core/models/campaign.model';

@Pipe({
  name: 'searchOnCampaign',
})
export class SearchOnCampaignPipe implements PipeTransform {
  transform(value: ICampaign[], statusTerm: string, channelTerm: string): ICampaign[] {
    const statusTermTrim = statusTerm.trim().toLowerCase();
    const channelTermTrim = channelTerm.trim().toLowerCase();

    const filterdArr = value.filter((cam) => {
      if (statusTermTrim.length == 0 && channelTermTrim.length == 0) {
        return cam;
      }
      if(statusTermTrim.length !==0 && channelTermTrim.length == 0){
        return cam?.status.trim().toLowerCase() === statusTermTrim;
      }
      if(channelTermTrim.length !== 0 && statusTermTrim.length ==0){
        return cam?.channel.trim().toLowerCase() === channelTermTrim;
      }

      if(channelTermTrim.length !== 0 && statusTermTrim.length !==0){
        return (cam?.channel.trim().toLowerCase() === channelTermTrim && cam?.status.trim().toLowerCase() === statusTermTrim);
      }
      return cam;
    });

    return filterdArr;
  }
}
