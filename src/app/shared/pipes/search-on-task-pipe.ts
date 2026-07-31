import { Pipe, PipeTransform } from '@angular/core';
import { ITask } from '../../core/models/task.model';

@Pipe({
  name: 'searchOnTask',
})
export class SearchOnTaskPipe implements PipeTransform {
  transform(value: ITask[], searchTerm: string, statusTerm: string, priority: string): ITask[] {
    const searchTermTrim = searchTerm.trim().toLowerCase();
    const statusTermTrim = statusTerm.trim().toLowerCase();
    const priorityTermTrim = priority.trim().toLowerCase();
    let filterBySearchTerm = false;

    return value.filter((task) => {
      if (
        priorityTermTrim.length !== 0 &&
        statusTermTrim.length !== 0 &&
        searchTermTrim.length !== 0
      ) {
        return (
          (task?.customerId?.name.toLowerCase().includes(searchTermTrim) ||
            task?.customerId?.email.toLowerCase().includes(searchTermTrim) ||
            task?.customerId?.companyName?.toLowerCase().includes(searchTermTrim) ||
            task?.description?.toLowerCase().includes(searchTermTrim) ||
            task?.assignedTo?.name.toLowerCase().includes(searchTermTrim) ||
            task?.assignedTo?.email?.toLowerCase().includes(searchTermTrim) ||
            task?.title.toLowerCase().includes(searchTermTrim) ||
            task?.status.toLowerCase().includes(searchTermTrim) ||
            task?.priority.toLowerCase().includes(searchTermTrim)) &&
          task?.priority.toLowerCase().includes(priorityTermTrim) &&
          task?.status.toLowerCase().includes(statusTermTrim)
        );
      }
      if (priorityTermTrim.length !== 0 && statusTermTrim.length !== 0) {
        return (
          task?.priority.toLowerCase().includes(priorityTermTrim) &&
          task?.status.toLowerCase().includes(statusTermTrim)
        );
      }

      if (priorityTermTrim.length !== 0 && searchTermTrim.length !== 0) {
        return (
          task?.priority.toLowerCase().includes(priorityTermTrim) &&
          (task?.customerId?.name.toLowerCase().includes(searchTermTrim) ||
            task?.customerId?.email.toLowerCase().includes(searchTermTrim) ||
            task?.customerId?.companyName?.toLowerCase().includes(searchTermTrim) ||
            task?.description?.toLowerCase().includes(searchTermTrim) ||
            task?.assignedTo?.name.toLowerCase().includes(searchTermTrim) ||
            task?.assignedTo?.email?.toLowerCase().includes(searchTermTrim) ||
            task?.title.toLowerCase().includes(searchTermTrim) ||
            task?.status.toLowerCase().includes(searchTermTrim) ||
            task?.priority.toLowerCase().includes(searchTermTrim))
        );
      }

      if (statusTermTrim.length !== 0 && searchTermTrim.length !== 0) {
        return (
          task?.status.toLowerCase().includes(statusTermTrim) &&
          (task?.customerId?.name.toLowerCase().includes(searchTermTrim) ||
            task?.customerId?.email.toLowerCase().includes(searchTermTrim) ||
            task?.customerId?.companyName?.toLowerCase().includes(searchTermTrim) ||
            task?.description?.toLowerCase().includes(searchTermTrim) ||
            task?.assignedTo?.name.toLowerCase().includes(searchTermTrim) ||
            task?.assignedTo?.email?.toLowerCase().includes(searchTermTrim) ||
            task?.title.toLowerCase().includes(searchTermTrim) ||
            task?.status.toLowerCase().includes(searchTermTrim) ||
            task?.priority.toLowerCase().includes(searchTermTrim))
        );
      }

      if (searchTermTrim.length !== 0) {
        return (
          task?.customerId?.name.toLowerCase().includes(searchTermTrim) ||
          task?.customerId?.email.toLowerCase().includes(searchTermTrim) ||
          task?.customerId?.companyName?.toLowerCase().includes(searchTermTrim) ||
          task?.description?.toLowerCase().includes(searchTermTrim) ||
          task?.assignedTo?.name.toLowerCase().includes(searchTermTrim) ||
          task?.assignedTo?.email?.toLowerCase().includes(searchTermTrim) ||
          task?.title.toLowerCase().includes(searchTermTrim) ||
          task?.status.toLowerCase().includes(searchTermTrim) ||
          task?.priority.toLowerCase().includes(searchTermTrim)
        );
      }

      if (statusTermTrim.length !== 0) {
        return task?.status.toLowerCase().includes(statusTermTrim);
      }

      if (priorityTermTrim.length !== 0) {
        return task?.priority.toLowerCase().includes(priorityTermTrim);
      }

      return task;
    });
  }
}
