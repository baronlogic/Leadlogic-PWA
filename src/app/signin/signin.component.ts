import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';

import { PersonsService } from '../services/persons.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  user: any;

  auxRes: any;

  signInForm: FormGroup;

  hidePassword = true;

  bSignIn = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private personsService: PersonsService
  ) 
  { }

  ngOnInit() {
    if(localStorage.getItem('userLogged')){
      this.goToDashboard();
    }
    this.signInForm = this.formBuilder.group({
      Identifier: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  handleSignIn(){
    this.bSignIn = true;
    let formData = new FormData();
    formData.append('Identifier', this.signInForm.get('Identifier').value);
    formData.append('Password', this.signInForm.get('Password').value);
    //console.log(this.signInForm.value);
    this.personsService.validateUserCredentials(formData)
    .subscribe(
      res => {
        this.bSignIn = false;
        //console.log(res);
        this.auxRes = res;
        if(this.auxRes.type == 'error'){
          this.openSnackBar(this.auxRes.message);
          return;
        }
        else if(this.auxRes.type == 'success'){
          let auxUser = {
            personId: this.auxRes.person_id,
            clientId: this.auxRes.client_id,
            projectId: this.auxRes.project_id
          }
          localStorage.setItem('userLogged', JSON.stringify(auxUser));
          this.goToDashboard();
        }
      },
      err => {
        this.bSignIn = false;
        //console.log(err.message);
        this.openSnackBar(err.message);
      }
    );
  }

}
