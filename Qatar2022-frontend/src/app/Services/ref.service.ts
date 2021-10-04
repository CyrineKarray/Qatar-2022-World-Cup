import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatchEntity } from '../Models/match';
import { environment } from 'src/environments/environment';
import { Ref } from '../Models/ref';
import { TokenStorageService } from './token-storage.service';


@Injectable({
  providedIn: 'root'
})

export class RefService {
  

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private tokenStorage:TokenStorageService) { }

  public getRefs(): Observable<Ref[]> {
    return this.http.get<Ref[]>(`${this.apiServerUrl}/ref`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public addRef(ref: Ref): Observable<Ref> {
    return this.http.post<Ref>(`${this.apiServerUrl}/ref`, ref, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public updateRef(ref: Ref,refId: any): Observable<void>{
    return this.http.put<void>(`${this.apiServerUrl}/ref/${refId}`, ref, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public deleteRef(refId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/ref/${refId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public linkRefToMatch(refId:any, matchId:number):Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/ref/link/${refId}/${matchId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } })
  }
}