import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { ScanComponent } from './scan/scan.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [PagesComponent, AboutComponent, AccountComponent, DashboardComponent, LeadDetailsComponent, ScanComponent, SettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
