import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {MatTableDataSource} from '@angular/material/table';

import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonsService } from '../services/persons.service';
import { DeviceScansService } from '../services/device-scans.service';

export interface Exhibitor {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
}

const ELEMENT_DATA: Exhibitor[] = [
  {id: 1, lastName: 'Martinez', firstName: 'John', company: 'Shocklogic'},
  {id: 2, lastName: 'Ramirez', firstName: 'Gabriel', company: 'Shocklogic'},
  {id: 3, lastName: 'Mogollon', firstName: 'Jose', company: 'Shocklogic'},
  {id: 4, lastName: 'Carrero', firstName: 'Jesus', company: 'Shocklogic'},
  {id: 5, lastName: 'Cepeda', firstName: 'Bryand', company: 'Shocklogic'},
  {id: 6, lastName: 'Baron', firstName: 'Rafael', company: 'Shocklogic'},
  {id: 7, lastName: 'Cepeda', firstName: 'Reynaldo', company: 'Shocklogic'},
  {id: 8, lastName: 'Gonzalez', firstName: 'Francisco', company: 'Shocklogic'},
  {id: 9, lastName: 'Escudero', firstName: 'Cesar', company: 'Shocklogic'},
  {id: 10, lastName: 'Barrientos', firstName: 'Jose', company: 'Shocklogic'},
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;
  alluserData: any;
  contactsData: any;

  displayedColumns: string[] = ['Family_Name', 'First_Name', 'Company'];
  dataSource: any;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private personsService: PersonsService,
    private deviceScansService: DeviceScansService
  ) 
  { }

  ngOnInit() {
    if(!localStorage.getItem('userLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('userLogged'));
    this.getUserData(this.user.clientId, this.user.projectId, this.user.personId);
    this.getTheContacts(this.user.clientId, this.user.projectId, this.user.personId);
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
        this.alluserData = res;
        //console.log(this.alluserData);
        this.openSnackBar('Welcome '+this.alluserData.First_Name+' '+this.alluserData.Family_Name);
      },
      err => {
        console.log(err);
      }
    );
  }

  getTheContacts(clientId: string, projectId: string, personId: string){
    this.deviceScansService.getAllScans(clientId, projectId, personId)
    .subscribe(
      res => {
        this.contactsData = res;
        this.dataSource = new MatTableDataSource(this.contactsData);
        console.log(this.dataSource.filteredData);
      },
      err => {
        console.log(err);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
