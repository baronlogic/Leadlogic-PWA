import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

import { SharedModule } from '../shared/shared.module';
import { LoginAdminComponent } from './login-admin/login-admin.component';

@NgModule({
  declarations: [LoginComponent, LoginAdminComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
