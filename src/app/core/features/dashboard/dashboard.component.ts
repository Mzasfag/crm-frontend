import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DashboardStatusService } from '../../services/dashboard-status.service';
import { IDashboardStatus } from '../../models/dashboard-status.model';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddDealFormComponent } from '../../../shared/components/add-deal-form/add-deal-form.component';
import { SettingsService } from '../../services/settings.service';
import { ChartModule } from 'primeng/chart';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink, AddDealFormComponent, ChartModule, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardService = inject(DashboardStatusService);
  settingsService = inject(SettingsService);
  dealFormIsOpen = signal<boolean>(false);
  authService = inject(AuthService);
  ngOnInit(): void {
    this.dashboardService.getDashboardStats();
  }

  basicData: any;
  basicOptions: any;

  constructor() {
    // بنستخدم effect عشان لو الداتا اتحدثت من الـ API، الشارت يحدث نفسه أوتوماتيك
    effect(() => {
      const stagesData = this.dashboardService.dashboardStatus()?.deals?.byStage;

      if (stagesData && stagesData.length > 0) {
        // بنستخرج الـ Labels (Lead, Proposal, ...) والـ Counts (الأرقام) ديناميكياً
        const labels = stagesData.map((item: any) => item.stage);
        const counts = stagesData.map((item: any) => item.count);

        this.initChart(labels, counts);
      }
    });
  }

  initChart(labels: string[], dataValues: number[]) {
    this.basicData = {
      labels: labels,
      datasets: [
        {
          label: 'Deals Count',
          data: dataValues, // الداتا الحقيقية اللي جاية من الـ API
          backgroundColor: [
            'rgba(100, 116, 139, 0.2)',
            'rgba(59, 130, 246, 0.2)',
            'rgba(245, 158, 11, 0.2)',
            'rgba(16, 185, 129, 0.2)',
            'rgba(239, 68, 68, 0.2)',
          ],
          borderColor: [
            'rgb(100, 116, 139)',
            'rgb(59, 130, 246)',
            'rgb(245, 158, 11)',
            'rgb(16, 185, 129)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }

  initInitOptions() {
    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false, // دي بتخليه يتمدد ويملا الـ Div الحاضن تماماً
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'Cairo',
              size: 13,
            },
          },
        },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(226, 232, 240, 0.5)' },
          beginAtZero: true,
        },
      },
    };
  }

  get leadPercentage() {
    if (
      this.dashboardService.dashboardStatus() !== null &&
      this.dashboardService.dashboardStatus()?.summary?.totalDeals !== 0
    ) {
      return (
        100 *
        (this.dashboardService.dashboardStatus()?.deals?.byStage[0].count! /
          this.dashboardService.dashboardStatus()?.summary?.totalDeals!)
      ).toFixed(2);
    } else {
      return 0;
    }
  }
  get proposalDealPercentage() {
    if (
      this.dashboardService.dashboardStatus() !== null &&
      this.dashboardService.dashboardStatus()?.summary?.totalDeals !== 0
    ) {
      return (
        100 *
        (this.dashboardService.dashboardStatus()?.deals?.byStage[1].count! /
          this.dashboardService.dashboardStatus()?.summary?.totalDeals!)
      ).toFixed(2);
    } else {
      return 0;
    }
  }
  get negotiationDealPercentage() {
    if (
      this.dashboardService.dashboardStatus() !== null &&
      this.dashboardService.dashboardStatus()?.summary?.totalDeals !== 0
    ) {
      return (
        100 *
        (this.dashboardService.dashboardStatus()?.deals?.byStage[2].count! /
          this.dashboardService.dashboardStatus()?.summary?.totalDeals!)
      ).toFixed(2);
    } else {
      return 0;
    }
  }
  get wonDealPercentage() {
    if (
      this.dashboardService.dashboardStatus() !== null &&
      this.dashboardService.dashboardStatus()?.summary?.totalDeals !== 0
    ) {
      return (
        100 *
        (this.dashboardService.dashboardStatus()?.deals?.byStage[3].count! /
          this.dashboardService.dashboardStatus()?.summary?.totalDeals!)
      ).toFixed(2);
    } else {
      return 0;
    }
  }
  get lostDealPercentage() {
    if (
      this.dashboardService.dashboardStatus() !== null &&
      this.dashboardService.dashboardStatus()?.summary?.totalDeals !== 0
    ) {
      return (
        100 *
        (this.dashboardService.dashboardStatus()?.deals?.byStage[4].count! /
          this.dashboardService.dashboardStatus()?.summary?.totalDeals!)
      ).toFixed(2);
    } else {
      return 0;
    }
  }

  toggleDealForm() {
    this.dealFormIsOpen.set(!this.dealFormIsOpen());
  }

  setDealFormStatus(data: boolean) {
    this.dealFormIsOpen.set(data);
  }
}
