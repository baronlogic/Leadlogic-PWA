import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {environment} from '../../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DeviceScansService {

  constructor(private http: HttpClient) { }

  createNewDeviceScanRecord(){}

  saveNotesForAPerson(){}

  getAllScans(){}

}
