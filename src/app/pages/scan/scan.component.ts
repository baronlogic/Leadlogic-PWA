import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService } from 'src/app/core/services/persons.service';
import { DeviceScansService } from 'src/app/core/services/device-scans.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;

  auxDevice: any;

  scannerEnabled = true;

  bLoading = false;

  bPersonId = false;
  personId: string;
  personScanned: any;

  user: any;

  notesForm: FormGroup;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private personsService: PersonsService,
    private devicesScanService: DeviceScansService
  ) 
  { }

  ngOnInit() {
    if(!localStorage.getItem('leadLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
    this.notesForm = this.formBuilder.group({
      Notes: [''],
    });
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
    this.bPersonId = false;
    this.currentDevice = this.auxDevice;
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
    formData.append('Misc_Data', 'Lead Retrieval');
    formData.append('Last_Scanned', this.getTimeFormat());
    this.devicesScanService.saveScanRecord(this.user.clientId, this.user.projectId, formData)
    .subscribe(
      res => {
        //console.log(res);
        this.openSnackBar("Person id scanned successfully!");
        this.getScannedPersonData();
      },
      err => {
        //console.log(err);
        this.openSnackBar("Something went wrong!");
        this.bPersonId = true;
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
    this.auxDevice = this.currentDevice;
    this.bLoading = true;
    this.scannerEnabled = false;
    let isnum = /^\d+$/.test($event);
    if($event.split(' ').length != 1 || !isnum || $event.length != 7){
      this.openSnackBar("The scanned code does not contain a person id!");
      this.bLoading = false;
      return;
    }
    else{
      this.personId = $event;
      this.getUserData(this.user.clientId, this.user.projectId, this.personId);
    }
  }

  getScannedPersonData(){
    this.personsService.getSpecificPersonRecord(this.user.clientId, this.user.projectId, this.personId)
    .subscribe(
      res => {
        console.log(res);
        this.personScanned = res;
        this.bPersonId = true;
        this.bLoading = false;
      },
      err => {
        console.log(err);
        this.bPersonId = true;
        this.bLoading = false;
      }
    );
  }

  saveNotes(){
    let formData = new FormData();
    formData.append('Person_Id', this.personId);
    formData.append('Notes', this.notesForm.get('Notes').value);
    formData.append('Device_Id', this.user.personId);
    this.devicesScanService.saveNotesForAPerson(this.user.clientId, this.user.projectId, formData)
    .subscribe(
      res => {
        console.log(res);
        this.openSnackBar("Notes saved successfully!");
        this.reloadScanner();
        this.personScanned = false;
      },
      err => {
        console.log(err);
        this.openSnackBar("Something went wrong!");
        this.reloadScanner();
        this.personScanned = false;
      }
    );
  }

}
