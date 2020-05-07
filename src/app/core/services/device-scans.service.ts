import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceScansService {
  private readonly deviceScansUrl;

  constructor(private http: ApiService) {
    this.deviceScansUrl = 'DeviceScans';
  }

  saveScanRecord(clientId: string, projectId: string, scanRecord: any){
    return this.http.post(clientId+'-'+projectId+'-2-0/'+this.deviceScansUrl, scanRecord, this.http.httpOptions);
  }

  saveNotesForAPerson(clientId: string, projectId: string, notes: FormData){
    return this.http.post(clientId+'-'+projectId+'-2-0/DeviceScanNotes', notes, this.http.httpOptions);
  }

  getAllScans(clientId: string, projectId: string, personId: number){
    return this.http.get(clientId+'-'+projectId+'-2-0/'+this.deviceScansUrl+'/'+personId, this.http.httpOptions);
  }

  getNotesForAPerson(clientId: string, projectId: string, personId: number, deviceId: number): any{
    return this.http.get(clientId+'-'+projectId+'-2-0/DeviceScanNotes/'+personId+'/'+deviceId, this.http.httpOptions);
  }

  sendLeadsByEmail(clientId: string, projectId: string, deviceId: number, leadsData: any){
    return this.http.post(clientId+'-'+projectId+'-2-0/'+this.deviceScansUrl+'/sendleads/'+deviceId, leadsData, this.http.httpOptions);
  }
}
