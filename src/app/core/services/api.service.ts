import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  API_URL = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
    'Token-App': '7875d82ca05f8ba818011eb04a890c20cb44c52e'
    })
  }

  constructor(protected http: HttpClient) { }
}
