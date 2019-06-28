import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';

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

  constructor() { }

  ngOnInit() {
  }

  displayedColumns: string[] = ['id', 'lastName', 'firstName', 'company'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
