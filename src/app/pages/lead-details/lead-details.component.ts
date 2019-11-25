import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceScansService } from 'src/app/core/services/device-scans.service';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss']
})
export class LeadDetailsComponent implements OnInit {

  user: any;
  lead: any;
  notesForm: FormGroup;
  bNotes = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private devicesScanService: DeviceScansService
  ) { }

  ngOnInit() {
    if(!localStorage.getItem('leadLogged')){
      this.goToLogin();
      return;
    }
    if(!localStorage.getItem('leadDetails')){
      this.goToDashboard();
      return;
    }
    this.user = JSON.parse(localStorage.getItem('leadLogged'));
    this.lead = JSON.parse(localStorage.getItem('leadDetails'));
    localStorage.removeItem('leadDetails');
    this.notesForm = this.formBuilder.group({
      Notes: [this.lead.notes],
    });
    this.notesForm.get('Notes').disable();
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goToLogin(){
    this.router.navigate(['']);
  }

  goToDashboard(){
    this.router.navigate(['pages']);
  }

  isDisabled(){
    this.bNotes = !this.bNotes;
    if(!this.bNotes) {
      this.notesForm.get('Notes').disable();
    } else {
      this.notesForm.get('Notes').enable();
     }
   }

   saveNotes(){
    let formData = new FormData();
    formData.append('Person_Id', this.lead.Person_Id);
    formData.append('Notes', this.notesForm.get('Notes').value);
    formData.append('Device_Id', this.user.personId);
    this.devicesScanService.saveNotesForAPerson(this.user.clientId, this.user.projectId, formData)
    .subscribe(
      res => {
        this.openSnackBar("Notes saved successfully!");
        this.isDisabled();
      },
      err => {
        this.openSnackBar("Something went wrong!");
        this.isDisabled();
      }
    );
   }

}
