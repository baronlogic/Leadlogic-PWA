import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService } from 'src/app/core/services/persons.service';
import { UserLogged } from 'src/app/core/models/interfaces/user-logged';
import { DeviceScansService } from 'src/app/core/services/device-scans.service';

@Component({
  selector: 'app-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss']
})
export class LeadDetailsComponent implements OnInit {

  userLogged: UserLogged;
  personId: number;
  private sub: any;
  leadDetails: any;
  existingText: string;
  notesForm: FormGroup;
  bNotes = false;
  bSavingNotes = false;
  bSaved = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private personsService: PersonsService,
    private deviceScansService: DeviceScansService
  ) { }

  ngOnInit(): void {
    this.userLogged = JSON.parse(localStorage.getItem('userLogged'));
    this.sub = this.route.params.subscribe(params => {
      this.personId = +params['personId']; // (+) converts string 'id' to a number
    });
    this.getLeadDetails();
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  goToHome(){
    this.router.navigate(['pages/home']);
  }

  getLeadDetails(){
    this.personsService.getSpecificPersonRecord(this.userLogged.client_id, this.userLogged.project_id, this.personId)
    .subscribe(
      res => {
        console.log(res);
        this.leadDetails = res;
        this.getLeadNotes();
      },
      err => {
        console.log(err);
      }
    );
  }

  getLeadNotes(){
    this.deviceScansService.getNotesForAPerson(this.userLogged.client_id, this.userLogged.project_id, this.personId, this.userLogged.person_id)
    .subscribe(
      res => {
        if(res == null){
          this.leadDetails.Notes = '';
          this.notesForm = this.formBuilder.group({
            Notes: [''],
          });
        }
        else{
          this.leadDetails.Notes = res.Notes;
          this.notesForm = this.formBuilder.group({
            Notes: [this.leadDetails.Notes],
          });
        }
        this.notesForm.get('Notes').disable();
      },
      err => {
        console.log(err);
      }
    );
  }

  editNotes(){
    this.bNotes = !this.bNotes;
    if(!this.bNotes) {
      this.notesForm.get('Notes').disable();
      if(!this.bSaved){
        this.notesForm.get('Notes').setValue(this.existingText);
      }
      this.bSaved = false;
    } 
    else {
      this.notesForm.get('Notes').enable();
      this.existingText = this.notesForm.get('Notes').value;
    }
  }

  saveNotes(){
    this.bSaved = true;
    this.bSavingNotes = true;
    let notesFormData = new FormData();
    notesFormData.append('Person_Id', this.personId.toString());
    notesFormData.append('Notes', this.notesForm.get('Notes').value);
    notesFormData.append('Device_Id', this.userLogged.person_id.toString());
    this.deviceScansService.saveNotesForAPerson(this.userLogged.client_id, this.userLogged.project_id, notesFormData)
    .subscribe(
      res => {
        this.bSavingNotes = false;
        this.leadDetails.Notes = this.notesForm.get('Notes').value;
        this.openSnackBar("Notes saved successfully!");
        this.editNotes();
      },
      err => {
        this.bSavingNotes = false;
        this.openSnackBar("Something went wrong!");
        this.editNotes();
      }
    );
  }

}
