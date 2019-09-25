import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService } from 'src/app/core/services/persons.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any;
  signInForm: FormGroup;
  hidePassword = true;
  bSignIn = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private personsService: PersonsService
  ){}

  ngOnInit() {
    //checkLeadLogged
    if(localStorage.getItem('leadLogged')){
      this.goToDashboard();
      return;
    }
    this.InstantiateForm();
  }

  InstantiateForm(){
    this.signInForm = this.formBuilder.group({
      Identifier: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 30000,
    });
  }

  goToDashboard() {
    this.router.navigate(['pages']);
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
      let auxRes: any = res;
        if(auxRes.type == 'error'){
          this.openSnackBar(auxRes.message);
          return;
        }
        else if(auxRes.type == 'success'){
          let auxUser = {
            personId: auxRes.person_id,
            clientId: auxRes.client_id,
            projectId: auxRes.project_id
          }
          localStorage.setItem('leadLogged', JSON.stringify(auxUser));
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
