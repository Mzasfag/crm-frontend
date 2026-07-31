import { Component, inject, input, OnInit, output, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';
import { NotifyService } from '../../../core/services/notify.service';
import { isPlatformBrowser } from '@angular/common';
import { IUser } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-model',
  imports: [ReactiveFormsModule, ErrorAlertComponent],
  templateUrl: './team-model.component.html',
  styleUrl: './team-model.component.css',
})
export class TeamModelComponent implements OnInit {
  handleuserformIsOpen = output<boolean>();
  private UserService = inject(UserService);
  private notifyService = inject(NotifyService);
  selectedUserUpdate = signal<IUser | null>(null);
  private platformId = inject(PLATFORM_ID);
  userform = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('', [Validators.required]),
  });
  userformUpdate = new FormGroup({
    name: new FormControl('', [Validators.required]), // بدون validators لو مش إجباري
    email: new FormControl('', [Validators.required, Validators.email]), // لو كتب إيميل لازم يكون صحيح، لو سابه فاضي مبيعملش إيرور
    password: new FormControl('', [Validators.minLength(6)]), // لو كتب باسورد لازم 6 حروف، لو سابه فاضي مبيعملش إيرور
    role: new FormControl('', [Validators.required]), // بدون validators
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const selectedUserData = localStorage.getItem('selectedUserData');
      if (selectedUserData !== undefined) {
        this.userformUpdate.patchValue(JSON.parse(selectedUserData!));
        this.selectedUserUpdate.set(JSON.parse(selectedUserData!));
      }
    }
  }

  // nameController
  get nameController() {
    return this.userform.get('name');
  }

  // emailUpdateController
  get emailController() {
    return this.userform.get('email');
  }

  // passwordController
  get passwordController() {
    return this.userform.get('password');
  }

  // roleController
  get roleController() {
    return this.userform.get('role');
  }

  // update form contollers

  // nameUpdateController
  get nameUpdateController() {
    return this.userformUpdate.get('name');
  }

  // emailUpdateController
  get emailUpdateController() {
    return this.userformUpdate.get('email');
  }

  // passwordUpdateController
  get passwordUpdateController() {
    return this.userformUpdate.get('password');
  }

  // roleUpdateController
  get roleUpdateController() {
    return this.userformUpdate.get('role');
  }

  closeuserform() {
    this.handleuserformIsOpen.emit(false);
    localStorage.removeItem('selectedUserData');
    this.userform.reset();
  }

  // on add User
  addUser() {
    if (this.userform.invalid) {
      this.userform.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.userform.value;
    this.UserService.addUser(data).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        this.userform.reset();
        this.closeuserform();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeuserform();
      },
    });
  }

  // on update User
  onUpdateUser() {
    if (this.userformUpdate.invalid) {
      this.userformUpdate.markAllAsTouched();
      this.notifyService.showError('Please Write Valid Data');
      return;
    }

    const data = this.userformUpdate.value;
    this.UserService.updateUser(data, this.selectedUserUpdate()?._id!).subscribe({
      next: (res) => {
        this.notifyService.showSuccess(res?.message!);
        localStorage.removeItem('selectedUserData');
        this.closeuserform();
      },
      error: (error) => {
        this.notifyService.showError(error?.error?.message);
        this.closeuserform();
      },
    });
  }
}
