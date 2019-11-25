import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScanComponent } from './scan/scan.component';
import { SettingsComponent } from './settings/settings.component';
import { PagesComponent } from './pages.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';



@NgModule({
  declarations: [DashboardComponent, ScanComponent, SettingsComponent, PagesComponent, LeadDetailsComponent, AboutComponent, AccountComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule
  ]
})
export class PagesModule { }
