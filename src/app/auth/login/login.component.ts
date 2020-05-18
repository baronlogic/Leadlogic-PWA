import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PersonsService } from 'src/app/core/services/persons.service';
import { UserLogged } from 'src/app/core/models/interfaces/user-logged';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;
  hidePassword = true;
  bSignIn = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private personsService: PersonsService
  ) { }

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      Identifier: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      Password: ['', Validators.required]
    });
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  goToDashboard() {
    this.router.navigate(['pages'], { replaceUrl: true });
  }

  handleSignIn(){
    this.bSignIn = true;
    let credentialsFormData = new FormData();
    credentialsFormData.append('Identifier', this.signInForm.get('Identifier').value);
    credentialsFormData.append('Password', this.signInForm.get('Password').value);

    this.personsService.validateUserCredentials(credentialsFormData)
    .subscribe(
      res => {
        this.bSignIn = false;
        /*Shocklogic's API returns 200 for ALL responses (a very very bad practice) 
        so the way we can 'check' if the login was successful 
        is with the TYPE attribute of the endpoint response*/
        if(res.type == 'error'){
          this.openSnackBar('Invalid User ID or Password...');
          return;
        }
        else if(res.type == 'success'){
          delete res.type; delete res.check; delete res.passed;
          let userLogged: UserLogged = res;
          localStorage.setItem('userLogged', JSON.stringify(userLogged));
          this.goToDashboard();
        }
      },
      err => {
        console.log(err);
        this.bSignIn = false;
        this.openSnackBar('Something went wrong...');
      }
    );
  }

}
