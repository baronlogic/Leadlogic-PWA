import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';
import { UserLogged } from 'src/app/core/models/interfaces/user-logged';
import { DeviceScansService } from 'src/app/core/services/device-scans.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userLogged: UserLogged;
  myScansData: any;
  filteredScansData: any[] = [];
  //This handles the mat-progress-bar
  bLeads = true;
  //This handles the error response when loading all the scans data
  bError = false;
  //The message for the custom error
  customError: string;

  _listFilter = '';

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredScansData = this.listFilter ? this.doFilter(this.listFilter) : this.myScansData;
  }

  doFilter(filterBy: string): any[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.myScansData.filter((participant: any) =>
    participant.First_Name.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
    participant.Family_Name.toLocaleLowerCase().indexOf(filterBy) !== -1 ||
    participant.Company.toLocaleLowerCase().indexOf(filterBy) !== -1
    );
  }

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private deviceScansService: DeviceScansService
  ) { }

  ngOnInit(): void {
    this.userLogged = JSON.parse(localStorage.getItem('userLogged'));
    this.getTheContacts(this.userLogged.client_id, this.userLogged.project_id, this.userLogged.person_id);
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  getTheContacts(clientId: string, projectId: string, personId: number){
    this.deviceScansService.getAllScans(clientId, projectId, personId)
    //We use the pipe and map to obtain only the attributes we need from each Lead
    .pipe(
      map(
        (resp: any) => { 
          return resp.map(({Person_Id, Family_Name, First_Name, Company, Job_Title, EMail, Mobile}) =>
            ({Person_Id, Family_Name, First_Name, Company, Job_Title, EMail, Mobile}));
        }
      )
    )
    .subscribe(
      res => {
        this.bLeads = false;
        //We filter to get a single scan per Lead (The last one was done)
        this.filterLeads(res);
        this.filteredScansData = this.myScansData;
      },
      err => {
        if(err.error.text){
          this.customError = err.error.text;
        }
        this.bError = true;
        this.bLeads = false;
      }
    );
  }

  filterLeads(leads){
    this.myScansData = Array.from(new Set(leads.map(s => s.Person_Id)))
    .map(id => {
        return {
          Person_Id: id,
          Family_Name: leads.find(s => s.Person_Id === id).Family_Name,
          First_Name: leads.find(s => s.Person_Id === id).First_Name,
          Company: leads.find(s => s.Person_Id === id).Company,
          Job_Title: leads.find(s => s.Person_Id === id).Job_Title,
          EMail: leads.find(s => s.Person_Id === id).EMail,
          Mobile: leads.find(s => s.Person_Id === id).Mobile
        };
    });
  }

  loadLeads(){
    this.bLeads = true;
    this.bError = false;
    this.getTheContacts(this.userLogged.client_id, this.userLogged.project_id, this.userLogged.person_id);
  }

  selectLead(personId){
    this.router.navigate(['pages/lead-details', personId]);
  }

}
