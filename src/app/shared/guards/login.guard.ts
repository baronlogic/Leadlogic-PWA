import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router){}
  
  canActivate(){
    //
    if(localStorage.getItem('userLogged') && !localStorage.getItem('adminLogged')){
      this.router.navigate(['pages'], { replaceUrl: true });
      return false;
    }
    //
    else if(localStorage.getItem('adminLogged') && !localStorage.getItem('userLogged')){
      this.router.navigate(['admin'], { replaceUrl: true });
      return false;
    }
    //
    else if(localStorage.getItem('userLogged') && localStorage.getItem('adminLogged')){
      localStorage.clear();
      return true;
    }
    //
    else{
      localStorage.clear();
      return true;
    }
    
  }
  
}
