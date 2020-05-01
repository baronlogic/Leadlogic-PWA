import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {

  auxRes: any;
  signInForm: FormGroup;
  hidePassword = true;
  bSignIn = false;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      Email: ['', Validators.required],
      Password: ['', Validators.required],
      Client_Id: ['']
    });
  }

  openSnackBar(message: string){
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  goToDashboard(){
    this.router.navigate(['admin'], { replaceUrl: true });
  }

  checkingInputEmail(){
    if(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm.test(this.signInForm.get('Email').value)){
      return true;
    }
    else{
      this.signInForm.controls['Client_Id'].setValue('');
      return false;
    }
  }

  checkInputClientId(){
    if(this.signInForm.value.Client_Id == ''){
      return true;
    }
    else{
      return false;
    }
  }

  handleSignIn(){
    this.bSignIn = true;

    let formData = new FormData();
    formData.append('email', this.signInForm.get('Email').value);
    formData.append('password', this.signInForm.get('Password').value);

    //If we log in with an email
    if(this.checkingInputEmail()){
      this.loginWithEmail(this.signInForm.get('Client_Id').value, formData);
    }
    //If we log in with an username
    else{
      this.loginWithUser(formData);
    }

  }

  loginWithEmail(clientId, userForm){
    this.usersService.validateUserCredentials(clientId, userForm)
    .subscribe(
      res => {
        this.bSignIn = false;
        this.auxRes = res;
        this.checkResType(this.auxRes);
      },
      err => {
        this.bSignIn = false;
        this.openSnackBar(err.message);
      }
    );
  }

  loginWithUser(userForm){
    this.usersService.validateUserWithoutClientId(userForm)
    .subscribe(
      res => {
        this.bSignIn = false;
        this.auxRes = res;
        this.checkResType(this.auxRes);
      },
      err => {
        this.bSignIn = false;
        this.openSnackBar(err.message);
      }
    );
  }

  checkResType(res){
    if(res.type == 'error'){
      this.openSnackBar(res.message);
      return;
    }
    else if(res.type == 'success'){
      let auxUser = {
        id: res.id,
        clientId: res.client_id,
        firstName: res.first_name,
        familyName: res.family_name,
      }
      localStorage.setItem('userLogged', JSON.stringify(auxUser));
      this.goToDashboard();
    }
  }

}
