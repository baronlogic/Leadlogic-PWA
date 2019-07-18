import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl;

const ENDPOINT_NAME = 'Persons';

const httpOptions = {
  headers: new HttpHeaders({
    'Token-App': '7875d82ca05f8ba818011eb04a890c20cb44c52e'
  })
}

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  constructor(private http: HttpClient) { }

  validateUserCredentials(user: any){
    return this.http.post(API_URL+'NONE-NONE-2-/'+ENDPOINT_NAME+'/login/Type/pid', user, httpOptions);
  }

  getSpecificPersonRecord(clientId: string, projectId: string, personId: string){
    return this.http.get(API_URL+clientId+'-'+projectId+'-2-/'+ENDPOINT_NAME+'/'+personId, httpOptions);
  }

}
