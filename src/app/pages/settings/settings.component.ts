import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DeviceScansService } from 'src/app/core/services/device-scans.service';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user: any;
  leads: any;
  bLeads = false;
    
  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private excelService: ExcelService,
    private deviceScansService: DeviceScansService
  ) 
  { }

  ngOnInit() {
    if(!localStorage.getItem('leadLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goToLogin(){
    this.router.navigate(['']);
  }

  goToAbout(){
    this.router.navigate(['pages/about']);
  }

  goToAccount(){
    this.router.navigate(['pages/account']);
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  exportAsXLSX(data):void {
    this.excelService.exportAsExcelFile(data, this.user.clientId);
    this.openSnackBar('Leads successfully downloaded!');
  }

  getLeads(){
    this.bLeads = true;
    this.deviceScansService.getAllScans(this.user.clientId, this.user.projectId, this.user.personId).pipe(
      map(
        (resp: any) => { 
          return resp.map(({Person_Id, Last_Scanned, Prefix_Title, First_Name, Family_Name, Job_Title, Company, Address_1, Zip_Code, City, Country_Code, Email, Mobile}) =>
          ({Person_Id, Last_Scanned, Prefix_Title, First_Name, Family_Name, Job_Title, Company, Address_1, Zip_Code, City, Country_Code, Email, Mobile}));
        }
      )
    )
    .subscribe(
      res => {
        this.leads = res;
        if(this.leads.length == 0){
          this.bLeads = false;
          this.openSnackBar("You don't have leads scanned yet");
          return;
        }
        this.getLeadsNotes();
      },
      err => {
        this.bLeads = false;
        this.openSnackBar('Something went wrong...');
      }
    );
  }

  getNotes(element){
    return this.deviceScansService.getNotesForAPerson(this.user.clientId, this.user.projectId, element.Person_Id, this.user.personId)
  }

  getLeadsNotes(){
    let aux = [];
    for(let i = 0; i < this.leads.length; i++){
      aux.push(this.getNotes(this.leads[i]));
    }
    forkJoin(aux).subscribe(
      res => {
        let auxNotes: any = res;
        for(let i = 0; i < this.leads.length; i++){
          if(auxNotes[i] != null){
            this.leads[i].Notes = auxNotes[i].Notes;
          }
          else{
            this.leads[i].Notes = '';
          }
        }
        this.exportAsXLSX(this.leads);
        this.bLeads = false;
      },
      err => {
        this.bLeads = false;
        this.openSnackBar('Something went wrong...');
      }
    );
  }

}
