import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Spectator } from '../Models/spectator';
import { TokenStorageService } from './token-storage.service';



@Injectable({
  providedIn: 'root'
})
export class SpectatorService {
  private apiServerUrl =environment.apiBaseUrl;

  constructor(private http: HttpClient , private tokenStorage:TokenStorageService) { }

  public getSpectators(): Observable<any> {
    return this.http.get<any>(`${this.apiServerUrl}/spectator`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });

  }

  public addSpectator(spectator: Spectator): Observable<Spectator>{
    return this.http.post<Spectator>(`${this.apiServerUrl}/spectator`, spectator, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });

  }

  public updateSpectator(spectatorId: number, spectator: Spectator): Observable<Spectator>{
    return this.http.put<Spectator>(`${this.apiServerUrl}/spectator/${spectatorId}`, spectator, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });

  }
  public deleteSpectator(spectatorId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/spectator/${spectatorId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public linkSpectatorToTicket(spectatorId:number,ticketId:number): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/spectator/link/${spectatorId}/${ticketId}`,null, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }
  
}
