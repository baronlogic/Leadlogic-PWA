import { Component, OnInit } from '@angular/core';
import {BottomNavItem} from 'ngx-bottom-nav';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  items: BottomNavItem[] = [
    {icon: 'home', label: 'Home', routerLink: 'dashboard'},
    {icon: 'center_focus_weak', label: 'Scan', routerLink: 'scan'},
    {icon: 'settings', label: 'Settings', routerLink: 'settings'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
