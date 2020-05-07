import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router){}
  
  canActivate(){
    if(!localStorage.getItem('adminLogged')){
      this.router.navigate([''], { replaceUrl: true });
      return false;
    }
    else{
      return true;
    }
    
  }
  
}
