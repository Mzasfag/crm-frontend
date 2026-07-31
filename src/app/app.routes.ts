import { Routes } from '@angular/router';
import { authenticationGuard } from './core/guards/authentication.guard';
import { authorizaionGuard } from './core/guards/authorizaion.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./core/features/login/login.component').then((file) => file.LoginComponent),
  },

  {
    path: 'register-company',
    title: 'Register Company',
    loadComponent: () =>
      import('./core/features/register-company/register-company.component').then(
        (file) => file.RegisterCompanyComponent,
      ),
  },

  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        (file) => file.MainLayoutComponent,
      ),
    canActivate: [authenticationGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        title: 'Dashboard',
        loadComponent: () =>
          import('./core/features/dashboard/dashboard.component').then(
            (file) => file.DashboardComponent,
          ),
        canActivate: [authorizaionGuard],
      },
      {
        path: 'customers',
        title: 'Customers',
        loadComponent: () =>
          import('./core/features/customers/customers.component').then(
            (file) => file.CustomersComponent,
          ),
        canActivate: [authorizaionGuard],
      },
      {
        path: 'deals',
        title: 'Deals',
        loadComponent: () =>
          import('./core/features/deals/deals.component').then((file) => file.DealsComponent),
        canActivate: [authorizaionGuard],
      },
      {
        path: 'compaigns',
        title: 'Compaigns',
        loadComponent: () =>
          import('./core/features/campaigns/campaigns.component').then(
            (file) => file.CompaignsComponent,
          ),
        canActivate: [authenticationGuard],
      },
      {
        path: 'tasks',
        title: 'Tasks',
        loadComponent: () =>
          import('./core/features/tasks/tasks.component').then((file) => file.TasksComponent),
        canActivate: [authorizaionGuard],
      },
      {
        path: 'team',
        title: 'Team',
        loadComponent: () =>
          import('./core/features/team/team.component').then((file) => file.TeamComponent),
        canActivate: [authorizaionGuard],
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () =>
          import('./core/features/settings/settings.component').then(
            (file) => file.SettingsComponent,
          ),
      },
      {
        path: 'company-profile',
        title: 'Company profile',
        loadComponent: () =>
          import('./core/features/company-profile/company-profile.component').then(
            (file) => file.CompanyProfileComponent,
          ),
        canActivate: [authorizaionGuard],
      },
      {
        path: 'my-tasks',
        title: 'My Tasks',
        loadComponent: () =>
          import('./core/features/my-tasks/my-tasks.component').then(
            (file) => file.MyTasksComponent,
          ),
        canActivate: [authenticationGuard],
      },
    ],
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./core/features/not-authorized/not-authorized.component').then(
        (file) => file.NotAuthorizedComponent,
      ),
    title: 'Not Authorized',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/features/not-found/not-found.component').then(
        (file) => file.NotFoundComponent,
      ),
    title: 'Not Found',
  },
];
