import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchEntity } from '../Models/match';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';


@Injectable({
  providedIn: 'root'
})

export class MatchService {
  

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private tokenStorage:TokenStorageService) { }

  public getMatchEntity(): Observable<MatchEntity[]> {
    return this.http.get<MatchEntity[]>(`${this.apiServerUrl}/match/all`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public addMatchEntity(match: MatchEntity): Observable<MatchEntity> {
    return this.http.post<MatchEntity>(`${this.apiServerUrl}/match/add`, match,{ headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public updateMatchEntity(match: MatchEntity,matchId: number): Observable<void>{
    return this.http.put<void>(`${this.apiServerUrl}/match/${matchId}`, match, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public deleteMatchEntity(matchId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/match/delete/${matchId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public linkMatchToTicket(ticketId:number, matchId:number):Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/match/link/${ticketId}/${matchId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } })
  }
}