import { Component, OnInit } from '@angular/core';
import {BottomNavItem} from 'ngx-bottom-nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  items: BottomNavItem[] = [
    {icon: 'home', label: 'Home', routerLink: ''},
    {icon: 'search', label: 'Search', routerLink: ''},
    {icon: 'forum', label: 'Forum', routerLink: ''},
  ];

  constructor() { }

  ngOnInit() {
  }

}
