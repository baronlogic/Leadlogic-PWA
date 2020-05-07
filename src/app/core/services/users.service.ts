import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly usersUrl;
  private readonly userUrl;

  constructor(private http: ApiService) { 
    this.usersUrl = 'Users';
    this.userUrl = 'User';
  }

  validateUserCredentials(clientId: string, userFormData: FormData): any {
    return this.http.post(clientId+'-NONE-2-/'+this.usersUrl+'/login/', userFormData, this.http.httpOptions);
  }

  validateUserWithoutClientId(userFormData: FormData): any {
    return this.http.post('NONE-NONE-2-/'+this.userUrl+'/login/', userFormData, this.http.httpOptions);
  }

}
