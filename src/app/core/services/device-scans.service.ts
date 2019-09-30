import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

const ENDPOINT_NAME = 'DeviceScans';

@Injectable({
  providedIn: 'root'
})
export class DeviceScansService extends ApiService {

  saveScanRecord(clientId: string, projectId: string, scanRecord: any){
    return this.http.post(this.API_URL+clientId+'-'+projectId+'-2-0/'+ENDPOINT_NAME, scanRecord, this.httpOptions);
  }

  saveNotesForAPerson(clientId: string, projectId: string, notes: any){
    return this.http.post(this.API_URL+clientId+'-'+projectId+'-2-0/DeviceScanNotes', notes, this.httpOptions);
  }

  getAllScans(clientId: string, projectId: string, personId: string){
    return this.http.get(this.API_URL+clientId+'-'+projectId+'-2-0/'+ENDPOINT_NAME+'/'+personId, this.httpOptions);
  }

}
