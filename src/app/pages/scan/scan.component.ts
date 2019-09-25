import { Component, OnInit } from '@angular/core';
import {BottomNavItem} from 'ngx-bottom-nav';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {

  items: BottomNavItem[] = [
    {icon: 'home', label: 'Home', routerLink: ''},
    {icon: 'center_focus_weak', label: 'Scan', routerLink: 'scan'},
    {icon: 'settings', label: 'Settings', routerLink: 'settings'},
  ];

  constructor() { }

  ngOnInit() {
  }

}
