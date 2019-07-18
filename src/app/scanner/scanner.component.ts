import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { DeviceScansService } from '../services/device-scans.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  bPersonId = false;
  personId: string;

  constructor(private router: Router) { }

  ngOnInit() {
    if(!localStorage.getItem('userLogged')){
      this.goToLogin();
      return;
    }
  }

  goToLogin() {
    this.router.navigate(['']);
  }

  scanSuccessHandler($event){
    this.bPersonId = true;
    console.log($event);
    this.personId = $event;
  }

}
