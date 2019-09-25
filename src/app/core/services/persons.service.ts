import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

const ENDPOINT_NAME = 'Persons';

@Injectable({
  providedIn: 'root'
})
export class PersonsService extends ApiService {

  validateUserCredentials(user: any){                                /*login/Type/pid*/
    return this.http.post(this.API_URL+'NONE-NONE-2-/'+ENDPOINT_NAME+'/login/', user, this.httpOptions);
  }

  getSpecificPersonRecord(clientId: string, projectId: string, personId: string){
    return this.http.get(this.API_URL+clientId+'-'+projectId+'-2-/'+ENDPOINT_NAME+'/'+personId, this.httpOptions);
  }

}
