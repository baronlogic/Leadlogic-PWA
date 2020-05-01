import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

const ENDPOINT_NAME = 'Users';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends ApiService {

  validateUserCredentials(clientId: string, user: any){
    return this.http.post(this.API_URL+clientId+'-NONE-2-/'+ENDPOINT_NAME+'/login/', user, this.httpOptions);
  }

  validateUserWithoutClientId(user: any){
    return this.http.post(this.API_URL+'NONE-NONE-2-/User/login/', user, this.httpOptions);
  }

}
