import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonsService } from '../services/persons.service';
import { DeviceScansService } from '../services/device-scans.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;
  alluserData: any;
  contactsData: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

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
        //console.log(err);
      }
    );
  }

  getTheContacts(clientId: string, projectId: string, personId: string){
    this.deviceScansService.getAllScans(clientId, projectId, personId)
    .subscribe(
      res => {
        this.contactsData = res;
        this.dataSource = new MatTableDataSource(this.contactsData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //console.log(this.dataSource.filteredData);
      },
      err => {
        //console.log(err);
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
