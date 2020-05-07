import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogged } from 'src/app/core/models/interfaces/user-logged';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  userLogged: UserLogged;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userLogged = JSON.parse(localStorage.getItem('userLogged'));
  }

  goToHome(){
    this.router.navigate(['pages/settings']);
  }

}
