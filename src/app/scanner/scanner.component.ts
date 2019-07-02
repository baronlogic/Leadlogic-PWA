import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {

  bPersonId = false;
  personId: string;

  constructor() { }

  ngOnInit() {
  }

  scanSuccessHandler($event){
    this.bPersonId = true;
    console.log($event);
    this.personId = $event;
  }

}
