import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user';
import { environment } from 'src/environments/environment';
import { Role } from '../Models/role';
import { RoleService } from './role.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private tokenStorage:TokenStorageService) { }

  public getUsers():Observable<User[]>{
    return this.http.get<[User]>(`${this.apiServerUrl}/user`);
  }

  public addUser(user: User): Observable<void> {
    return this.http.post<void>(`${this.apiServerUrl}/user/signup`, user, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public updateUser(user: User,userId: number): Observable<void>{
    return this.http.put<void>(`${this.apiServerUrl}/user/${userId}`, user, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/user/${userId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public clearRoles(userId: number): Observable<void> {
    return this.http.get<void>(`${this.apiServerUrl}/role/clear/${userId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }
}
