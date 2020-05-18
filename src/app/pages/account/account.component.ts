import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogged } from 'src/app/core/models/interfaces/user-logged';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  userLogged: UserLogged;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userLogged = JSON.parse(localStorage.getItem('userLogged'));
    console.log(this.userLogged);
  }

  goToHome(){
    this.router.navigate(['pages/settings']);
  }

}
