import { Component, OnInit } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

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

  signOut(){
    localStorage.clear();
    this.router.navigate(['auth/login-admin'], { replaceUrl: true });
  }

}
