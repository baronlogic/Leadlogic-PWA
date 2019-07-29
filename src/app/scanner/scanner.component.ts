import { Component, OnInit } from '@angular/core';

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

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;

  scannerEnabled = true;
  bScanner = false;
  bCameras = false;
  bLoading = false;

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

  reloadScanner(){
    this.scannerEnabled = true;
    this.bScanner = false;
    this.bCameras = false;
    this.bPersonId = false;
  }

  getTimeFormat(){
    let d = new Date();

    let year;
    let month;
    let day;
    let hour;
    let minutes;
    let seconds;

    year = d.getFullYear();

    let months = ["01","02","03","04","05","06","07","08","09","10","11","12"];

    month = months[d.getMonth()];

    if(d.getDate() <= 9){
	    day = "0"+d.getDate();
    }
    else{
	    day = d.getDate();
    }

    if(d.getHours() <= 9){
	    hour = "0"+d.getHours();
    }
    else{
	    hour = d.getHours();
    }

    if(d.getMinutes() <= 9){
	    minutes = "0"+d.getMinutes();
    }
    else{
	    minutes = d.getMinutes();
    }

    if(d.getSeconds() <= 9){
	    seconds = "0"+d.getSeconds();
    }
    else{
	    seconds = d.getSeconds();
    }
    return year+"-"+month+"-"+day+" "+hour+":"+minutes+":"+seconds;
  }

  saveScanRecord(personId: string){
    let formData = new FormData();
    formData.append('Device_Id', this.user.personId);
    formData.append('Person_Id', personId);
    formData.append('Scan_Result', 'VALID');
    formData.append('Last_Scanned', this.getTimeFormat());
    this.devicesScanService.saveScanRecord(this.user.clientId, this.user.projectId, formData)
    .subscribe(
      res => {
        //console.log(res);
        this.openSnackBar("Person id scanned successfully!");
        this.bPersonId = true;
        this.bScanner = true;
        this.bLoading = false;
      },
      err => {
        //console.log(err);
        this.openSnackBar("Something went wrong!");
        this.bPersonId = true;
        this.bScanner = true;
        this.bLoading = false;
      }
    );
  }

  getUserData(clientId: string, projectId: string, personId: string){
    this.personsService.getSpecificPersonRecord(clientId, projectId, personId)
    .subscribe(
      res => {
        //console.log(res);
        if(Array.isArray(res)){
          this.openSnackBar("The person id is not valid!");
          this.bScanner = true;
          this.bLoading = false;
          return;
        }
        else{
          this.saveScanRecord(personId);
        }
      },
      err => {
        //console.log(err);
        this.openSnackBar("Something went wrong!");
      }
    );
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  scanSuccessHandler($event){
    //console.log($event);
    this.bLoading = true;
    this.bCameras = true;
    this.scannerEnabled = false;
    let isnum = /^\d+$/.test($event);
    if($event.split(' ').length != 1 || !isnum || $event.length != 7){
      this.openSnackBar("The scanned code does not contain a person id!");
      this.bScanner = true;
      this.bLoading = false;
      return;
    }
    else{
      this.personId = $event;
      this.getUserData(this.user.clientId, this.user.projectId, this.personId);
    }
  }
}
