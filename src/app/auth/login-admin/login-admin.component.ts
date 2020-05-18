import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/core/services/users.service';
import { AdminLogged } from 'src/app/core/models/interfaces/admin-logged';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.scss']
})
export class LoginAdminComponent implements OnInit {

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
      duration: 5000,
    });
  }

  goToAdminDashboard() {
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
    let credentialsFormData = new FormData();
    credentialsFormData.append('email', this.signInForm.get('Email').value);
    credentialsFormData.append('password', this.signInForm.get('Password').value);
    //If we log in with an email
    if(this.checkingInputEmail()){
      this.loginWithEmail(this.signInForm.get('Client_Id').value, credentialsFormData);
    }
    //If we log in with an username
    else{
      this.loginWithUser(credentialsFormData);
    }
  }

  loginWithEmail(clientId, userForm){
    this.usersService.validateUserCredentials(clientId, userForm)
    .subscribe(
      res => {
        this.bSignIn = false;
        this.checkResType(res);
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
        this.checkResType(res);
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
      console.log(res);
      let leadlogicMobile = {
        license: res.systems.LeadlogicMobile,
        active:res.systems.LeadlogicMobileStatus
      }
      /*
      ACTIVE: we use it to show or not the system. 
      It is with this value that we are going to deactivate the system. 
      We handle this value with the System Status. 
      LICENSE: is to handle if the user has a paid license or not from the system.
      We handle it with the value with the name of the system. 
      The user can still login but we will show a message 
      that he is without a license to contact Shocklogic support
      1 is active and 0 is deactivated
      */
      if(leadlogicMobile.active == 0){
        this.openSnackBar('You do not have access available to use the Leadlogic Admin Mode, please contact Shocklogic support');
        return;
      }
      else if(leadlogicMobile.license == 0){
        this.openSnackBar('You do not have an active license for this system, please contact Shocklogic support');
      }
      /*We don't really use these attributes here, at least not for now
      neither do we use the TOKEN, I understand that it is only used in the Unified System Login 
      to verify sessions between Angular, Laravel and ASP Classic*/
      delete res.type; delete res.check; delete res.passed; delete res.isPerson; delete res.token; delete res.systems;
      let adminLogged: AdminLogged = res;
      localStorage.setItem('adminLogged', JSON.stringify(adminLogged));
      this.goToAdminDashboard();
    }
  }

}
