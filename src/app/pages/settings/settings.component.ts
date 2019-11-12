import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExcelService } from 'src/app/core/services/excel.service';
import { DeviceScansService } from 'src/app/core/services/device-scans.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user: any;
  leads: any;
  bLeads = false;

  data: any = [{
    eid: 'e101',
    ename: 'ravi',
    esal: 1000
    },{
    eid: 'e102',
    ename: 'ram',
    esal: 2000
    },{
    eid: 'e103',
    ename: 'rajesh',
    esal: 3000
    }
  ];
    

  constructor(
    private router: Router,
    private excelService: ExcelService,
    private deviceScansService: DeviceScansService
  ) 
  { }

  ngOnInit() {
    if(!localStorage.getItem('leadLogged')){
      this.goToLogin();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
    console.log(this.user);
  }

  goToLogin(){
    this.router.navigate(['']);
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['']);
  }

  exportAsXLSX(data):void {
    this.excelService.exportAsExcelFile(data, this.user.clientId);
 }

 getLeads(){
  this.bLeads = true;
  this.deviceScansService.getAllScans(this.user.clientId, this.user.projectId, this.user.personId).pipe(
    map(
      (resp: any) => { 
        return resp.map(({Last_Scanned, Prefix_Title, First_Name, Family_Name, Job_Title, Company, Address_1, Zip_Code, City, Country_Code, Email, Mobile}) =>
          ({Last_Scanned, Prefix_Title, First_Name, Family_Name, Job_Title, Company, Address_1, Zip_Code, City, Country_Code, Email, Mobile}));
      }
    )
  )
  .subscribe(
    res => {
       //console.log(res);
       this.leads = res;
       this.exportAsXLSX(this.leads);
       this.bLeads = false;
    },
    err => {
      console.log(err);
      this.bLeads = false;
      //this.openSnackBar(err.message);
    }
  );
}

}
