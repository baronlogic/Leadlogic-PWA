import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {
  private readonly personsUrl;

  constructor(private http: ApiService) {
    this.personsUrl = 'Persons';
  }

  validateUserCredentials(userCredentials: FormData) :any {     /*login/Type/pid*/
    return this.http.post('NONE-NONE-2-/'+this.personsUrl+'/login/', userCredentials, this.http.httpOptions);
  }

  getSpecificPersonRecord(clientId: string, projectId: string, personId: number){
    return this.http.get(clientId+'-'+projectId+'-2-/'+this.personsUrl+'/'+personId, this.http.httpOptions);
  }

}
