import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  bPersonId = false;
  personId: string;

  constructor(private router: Router) { }

  ngOnInit() {
    if(!localStorage.getItem('userLogged')){
      this.goToLogin();
      return;
    }
  }

  goToLogin() {
    this.router.navigate(['']);
  }

  scanSuccessHandler($event){
    this.bPersonId = true;
    console.log($event);
    this.personId = $event;
  }

}
