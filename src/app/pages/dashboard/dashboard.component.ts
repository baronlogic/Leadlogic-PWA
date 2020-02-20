import { Component, OnInit, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService } from '../../core/services/persons.service';
import { DeviceScansService } from '../../core/services/device-scans.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DashboardComponent implements OnInit {

  user: any;
  alluserData: any;
  contactsData: any;
  //This handles the mat-progress-bar
  bLeads = true;
  //This handles the error response when loading projects
  bError = false;
  //This handles the mat-spinner of the details button
  bDetails = false;
  //The message for the custom error
  customError: string;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  dataSource: any;
  columnsToDisplay = ['Family_Name', 'First_Name', 'Company'];
  expandedElement: any | null;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private personsService: PersonsService,
    private deviceScansService: DeviceScansService
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
    //this.getUserData(this.user.clientId, this.user.projectId, this.user.personId);
    this.getTheContacts(this.user.clientId, this.user.projectId, this.user.personId);
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  /*getUserData(clientId: string, projectId: string, personId: string){
    this.personsService.getSpecificPersonRecord(clientId, projectId, personId)
    .subscribe(
      res => {
        this.alluserData = res;
        //console.log(this.alluserData);
        if(false){
          this.openSnackBar('Welcome '+this.alluserData.First_Name+' '+this.alluserData.Family_Name);
        }
      },
      err => {
        //console.log(err);
        this.openSnackBar(err.message);
      }
    );
  }*/

  getTheContacts(clientId: string, projectId: string, personId: string){
    this.deviceScansService.getAllScans(clientId, projectId, personId).pipe(
      map(
        (resp: any) => { 
          return resp.map(({Person_Id, Family_Name, First_Name, Company, Job_Title, Email, Mobile}) =>
            ({Person_Id, Family_Name, First_Name, Company, Job_Title, Email, Mobile}));
        }
      )
    )
    .subscribe(
      res => {
        this.filterLeads(res);
        console.log(this.contactsData);
        this.dataSource = new MatTableDataSource(this.contactsData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.bLeads = false;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToDetails(element){
    this.bDetails = true;
    this.bLeads = true;
    this.deviceScansService.getNotesForAPerson(this.user.clientId, this.user.projectId, element.Person_Id, this.user.personId)
    .subscribe(
      res => {
        let aux: any = res;
        if(aux != null){
          element.notes = aux.Notes;
        }
        else{
          element.notes = '';
        }
        this.bDetails = false;
        this.bLeads = false;
        localStorage.setItem('leadDetails', JSON.stringify(element));
        this.router.navigate(['pages/lead-details']);
      },
      err => {
        this.bDetails = false;
        this.bLeads = false;
        this.openSnackBar('Something went wrong...');
      }
    );
  }

  loadLeads(){
    this.bLeads = true;
    this.bError = false;
    this.getTheContacts(this.user.clientId, this.user.projectId, this.user.personId);
  }

  filterLeads(leads){
    this.contactsData = Array.from(new Set(leads.map(s => s.Person_Id)))
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

}
