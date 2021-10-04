import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../Models/role';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private tokenStorage:TokenStorageService) { }

  public getRoles():Observable<Role[]>{
    return this.http.get<[Role]>(`${this.apiServerUrl}/role`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

  public addRole(role: Role):Observable<void>{
    console.log(role)
    return this.http.post<void>(`${this.apiServerUrl}/role`,role, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } })
  }

  public updateRole(role : Role, roleId:number): Observable<void>{
    return  this.http.put<void>(`${this.apiServerUrl}/role/${roleId}`,role, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } })
  }

  public deleteRole(roleId:number): Observable<void>{
    return  this.http.delete<void>(`${this.apiServerUrl}/role/${roleId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } })
  }

  public linkNewUserToRole(userId:number, roleId:number): Observable<void>{
    return this.http.get<void>(`${this.apiServerUrl}/role/link/${userId}/${roleId}`, { headers: { Authorization: `Bearer ${this.tokenStorage.getToken()}` } });
  }

}
