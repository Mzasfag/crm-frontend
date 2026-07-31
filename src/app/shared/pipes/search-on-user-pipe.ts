import { Pipe, PipeTransform } from '@angular/core';
import { IUser } from '../../core/models/user.model';

@Pipe({
  name: 'searchOnUser',
})
export class SearchOnUserPipe implements PipeTransform {
  transform(value: IUser[], searchUserTerm: string, roleTerm: string): IUser[] {
    const searchUserTermTrim = searchUserTerm.trim().toLowerCase();
    const roleTermTrim = roleTerm.trim().toLowerCase();

    return value.filter((user) => {
      if (roleTermTrim.length !== 0 && searchUserTermTrim.length !== 0) {
        return (
          (user?.role.toLowerCase().includes(searchUserTermTrim) ||
            user?.email.toLowerCase().includes(searchUserTermTrim) ||
            user?.name.toLowerCase().includes(searchUserTermTrim)) &&
          user?.role.toLowerCase().includes(roleTermTrim)
        );
      }

      if (searchUserTermTrim.length !== 0) {
        return (
          user?.role.toLowerCase().includes(searchUserTermTrim) ||
          user?.email.toLowerCase().includes(searchUserTermTrim) ||
          user?.name.toLowerCase().includes(searchUserTermTrim)
        );
      }

      if (roleTermTrim.length !== 0) {
        return user?.role.toLowerCase().includes(roleTermTrim);
      }
      return user;
    });
  }
}
