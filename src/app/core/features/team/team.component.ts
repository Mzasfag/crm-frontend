import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user.model';
import { IDashboardStatus } from '../../models/dashboard-status.model';
import { DashboardStatusService } from '../../services/dashboard-status.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotifyService } from '../../services/notify.service';
import { FormsModule } from '@angular/forms';
import { Toast } from 'primeng/toast';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { SearchOnUserPipe } from '../../../shared/pipes/search-on-user-pipe';
import { TeamModelComponent } from '../../../shared/components/team-model/team-model.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team',
  imports: [
    CommonModule,
    FormsModule,
    Toast,
    ConfirmDialogModule,
    SearchOnUserPipe,
    TeamModelComponent,
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css',
  providers: [MessageService, ConfirmationService],
})
export class TeamComponent {
  dashboardStatusService = inject(DashboardStatusService);
  messageService = inject(MessageService);
  notifyService = inject(NotifyService);
  userService = inject(UserService);
  authService = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  dashboardStats = signal<IDashboardStatus | null>(null);
  userList = signal<IUser[] | null>(null);
  userListCloned = signal<IUser[] | null>(null);
  activeDropdownId = signal<string | null>(null);
  userFormIsOpen = signal<boolean>(false);
  roleTerm = '';
  searchUserTerm = '';
  stopNext = signal<boolean>(false);
  stopPrev = signal<boolean>(false);
  selecteduserData = signal<IUser | null>(null);
  nevigateArr = signal<number[]>([0, 4]);

  ngOnInit(): void {
    this.dashboardStatusService.getDashboardStats();
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.userList.set(res?.data?.users!);
        this.userListCloned.set(res?.data?.users!);
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
      },
    });
  }

  toggleUserForm() {
    this.userFormIsOpen.set(!this.userFormIsOpen());
    localStorage.removeItem('selecteduserData');
  }
  toggleDropDown(userId: string) {
    // لو العميل ده هو نفسه المفتوح حالياً، اقفله (خليه null)، لو عميل تاني افتحه
    this.activeDropdownId.update((currentId) => (currentId === userId ? null : userId));
  }

  // دالة مساعدة سريعة
  isDropdownOpen(userId: string): boolean {
    return this.activeDropdownId() === userId;
  }

  nextNeviagete() {
    const currentListLength = this.userListCloned()?.length ?? 0;

    this.nevigateArr.update(([start, end]) => {
      const nextStart = end;
      const nextEnd = end + 4;

      // لو الـ start الجديد عدى طول اللستة، نرجع زي ما كنا ونوقف الزرار
      if (nextStart >= currentListLength) {
        this.stopNext.set(true);
        return [start, end]; // محصلش تغيير
      }

      this.stopPrev.set(false); // طالما اتحركنا قدام يبقى الـ prev اشتغل

      // لو الـ end الجديد عدى اللستة، نخلي الـ end آخره طول اللستة
      const finalEnd = nextEnd > currentListLength ? currentListLength : nextEnd;

      // لو وصلنا للنهاية، نقفل الـ next
      if (finalEnd === currentListLength) {
        this.stopNext.set(true);
      }

      return [nextStart, finalEnd];
    });
  }

  prevNeviagete() {
    this.nevigateArr.update(([start, end]) => {
      const prevStart = start - 4;
      const prevEnd = start; // الـ end القديم بيبقى هو الـ start الجديد

      // لو الـ start الجديد بقى أقل من أو يساوي 0
      if (prevStart <= 0) {
        this.stopPrev.set(true);
        this.stopNext.set(false);
        return [0, 4]; // نرجع للبداية خالص
      }

      this.stopNext.set(false); // طالما رجعنا لورا يبقى الـ next متاح
      return [prevStart, prevEnd];
    });
  }

  handleUserForm(data: boolean) {
    this.userFormIsOpen.set(data);
    this.getAllUsers();
  }

  // setToUpdate
  setToUpdate(data: IUser) {
    this.userFormIsOpen.set(true);
    localStorage.setItem('selectedUserData', JSON.stringify(data));
  }

  // on delete user
  onDeleteUser(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Confirmed',
          detail: 'Request submitted',
        });

        this.userService.deleteUser(userId).subscribe({
          next: (res) => {
            this.notifyService.showSuccess(res?.message!);
            this.getAllUsers();
            this.toggleDropDown(userId);
            this.dashboardStatusService.getDashboardStats();
          },
          error: (error) => {
            this.notifyService.showError(error?.error?.message);
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'Process incomplete',
          life: 3000,
        });
        this.toggleDropDown(userId);
        return;
      },
      key: 'positionDialog',
    });
  }

  // get admin and manager users count
  getAdminAndMangerCount() {
    const filterArr = this.userList()?.filter((user) => {
      return user?.role.toLowerCase() == 'manager' || user?.role?.toLowerCase() == 'admin';
    });

    return filterArr?.length;
  }


  // sales member
  getSalesMember(){
    const filterdArr = this.userList()?.filter((user)=>{
      return user?.role?.toLowerCase() == 'sales';
    });
    return filterdArr?.length;
  }
  // another role member
  getAnotherRoleMember(){
    const filterdArr = this.userList()?.filter((user)=>{
      return user?.role?.toLowerCase() == 'developer' || user?.role?.trim().toLowerCase() == 'designer' || user?.role?.trim().toLowerCase() == 'contentcreator';
    });
    return filterdArr?.length;
  }
}
