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
  bDownload = false;
  bEmail = false;
    
  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private excelService: ExcelService,
    private deviceScansService: DeviceScansService
  ) 
  { }

  ngOnInit() {
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
        this.filterLeads(res);
        if(this.leads.length == 0){
          this.bDownload = false;
          this.bEmail = false;
          this.openSnackBar("You don't have leads scanned yet");
          return;
        }
        this.getLeadsNotes();
      },
      err => {
        this.bDownload = false;
          this.bEmail = false;
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
        if(this.bDownload){
          this.exportAsXLSX(this.leads);
        }
        else if(this.bEmail){
          this.sendLeadsByEmail();
        }
        this.bDownload = false;
          this.bEmail = false;
      },
      err => {
        this.bDownload = false;
          this.bEmail = false;
        this.openSnackBar('Something went wrong...');
      }
    );
  }

  filterLeads(leads){
    this.leads = Array.from(new Set(leads.map(s => s.Person_Id)))
    .map(id => {
        return {
          Person_Id: id,
          Family_Name: leads.find(s => s.Person_Id === id).Family_Name,
          First_Name: leads.find(s => s.Person_Id === id).First_Name,
          Company: leads.find(s => s.Person_Id === id).Company,
          Job_Title: leads.find(s => s.Person_Id === id).Job_Title,
          Email: leads.find(s => s.Person_Id === id).Email,
          Mobile: leads.find(s => s.Person_Id === id).Mobile
        };
    });
  }

  sendLeadsByEmail(){
    let formData = new FormData();
    formData.append('Leads_Data', JSON.stringify(this.leads));
    this.deviceScansService.sendLeadsByEmail(this.user.clientId, this.user.projectId, this.user.personId, formData)
    .subscribe(
      res => {
        let auxMessage: any = res;
        this.openSnackBar(auxMessage.success.message);
      },
      err => {
        //console.log(err);
        this.openSnackBar('Something went wrong...');
      }
    );
  }

  downloadLeads(){
    this.bDownload = true;
    this.getLeads();
  }

  emailLeads(){
    this.bEmail = true;
    this.getLeads();
  }

}
