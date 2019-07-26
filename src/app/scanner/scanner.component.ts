import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonsService } from '../services/persons.service';
import { DeviceScansService } from '../services/device-scans.service';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  scannerEnabled = true;

  bPersonId = false;
  personId: string;

  user: any;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private personsService: PersonsService,
    private devicesScanService: DeviceScansService
  ) 
  { }

  ngOnInit() {
    if(!localStorage.getItem('userLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('userLogged'));
    
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goToLogin() {
    this.router.navigate(['']);
  }

  getUserData(clientId: string, projectId: string, personId: string){
    this.personsService.getSpecificPersonRecord(clientId, projectId, personId)
    .subscribe(
      res => {
        //console.log(res);
        this.bPersonId = true;
        if(Array.isArray(res)){
          this.openSnackBar("The person id is not valid!")
          return;
        }
        else{
          this.openSnackBar("Person id scanned successfully!")
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  camerasFoundHandler($event){
    console.log($event);
  }

  scanSuccessHandler($event){
    console.log($event);
    this.scannerEnabled = false;
    let isnum = /^\d+$/.test($event);
    if($event.split(' ').length != 1 || !isnum || $event.length != 7){
      this.openSnackBar("The scanned code does not contain a person id!")
      return;
    }
    else{
      this.personId = $event;
      this.getUserData(this.user.clientId, this.user.projectId, this.personId);
    }
  }
}
