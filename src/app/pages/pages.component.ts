import { Component, OnInit } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Router } from '@angular/router';
import {BottomNavItem} from 'ngx-bottom-nav';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  items: BottomNavItem[] = [
    {icon: 'home', label: 'Home', routerLink: '/pages/home'},
    {icon: 'center_focus_weak', label: 'Scan', routerLink: '/pages/scan'},
    {icon: 'settings', label: 'Settings', routerLink: '/pages/settings'},
  ];

  constructor(
    private router: Router,
    private _focusMonitor: FocusMonitor
  ) 
  { 
    this._focusMonitor.stopMonitoring(document.getElementById('btn'));
  }

  ngOnInit(): void {
    this._focusMonitor.stopMonitoring(document.getElementById('btn'));
  }

}
