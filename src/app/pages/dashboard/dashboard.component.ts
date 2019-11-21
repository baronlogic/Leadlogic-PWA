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
    if(!localStorage.getItem('leadLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
    //this.getUserData(this.user.clientId, this.user.projectId, this.user.personId);
    this.getTheContacts(this.user.clientId, this.user.projectId, this.user.personId);
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goToLogin(){
    this.router.navigate(['']);
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
        this.contactsData = res;
        this.dataSource = new MatTableDataSource(this.contactsData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.bLeads = false;
      },
      err => {
        this.bError = true;
        this.bLeads = false;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToDetails(element){
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
        localStorage.setItem('leadDetails', JSON.stringify(element));
        this.router.navigate(['pages/lead-details']);
      },
      err => {
        this.openSnackBar('Something went wrong...');
      }
    );
  }

  loadLeads(){
    this.bLeads = true;
    this.bError = false;
    this.getTheContacts(this.user.clientId, this.user.projectId, this.user.personId);
  }

}
