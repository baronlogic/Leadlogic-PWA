import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScanComponent } from './scan/scan.component';
import { SettingsComponent } from './settings/settings.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';

const routes: Routes = [
  { 
    path: "",
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: "dashboard", component: DashboardComponent },
      { path: "scan", component: ScanComponent },
      { path: "settings", component: SettingsComponent }
    ]
  },
  { 
    path: "lead-details",
    component: LeadDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
