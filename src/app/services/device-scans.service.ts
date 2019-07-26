import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl;

const ENDPOINT_NAME = 'DeviceScans';

const httpOptions = {
  headers: new HttpHeaders({
    'Token-App': '7875d82ca05f8ba818011eb04a890c20cb44c52e'
  })
}

@Injectable({
  providedIn: 'root'
})
export class DeviceScansService {

  constructor(private http: HttpClient) { }

  saveScanRecord(){}

  saveNotesForAPerson(){}

  getAllScans(clientId: string, projectId: string, personId: string){
    return this.http.get(API_URL+clientId+'-'+projectId+'-2-0/'+ENDPOINT_NAME+'/'+personId, httpOptions);
  }

}
