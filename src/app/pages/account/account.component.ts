import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService } from 'src/app/core/services/persons.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user: any;
  userData: any;
  //This handles the mat-progress-bar
  bUser = true;
  //This handles the error response when loading projects
  bError = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private personsService: PersonsService
  ) { }

  ngOnInit() {
    if(!localStorage.getItem('leadLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
    this.getUserData(this.user.clientId, this.user.projectId, this.user.personId);
  }

  goToLogin(){
    this.router.navigate(['']);
  }

  goToSettings(){
    this.router.navigate(['pages/settings']);
  }

  getUserData(clientId: string, projectId: string, personId: string){
    this.personsService.getSpecificPersonRecord(clientId, projectId, personId)
    .subscribe(
      res => {
        this.userData = res;
        this.bUser = false;
      },
      err => {
        this.bUser = false;
        this.bError = true;
      }
    );
  }

  loadInfo(){
    this.bUser = true;
    this.bError = false;
    this.getUserData(this.user.clientId, this.user.projectId, this.user.personId);
  }

}
