import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  serverUrl: string = environment.url

  signUp(singupFormData: any): Observable<any> {
    return this.httpClient.post(`${this.serverUrl}/signup`, singupFormData).pipe(catchError((err) => err
    ));
  }

  login(loginFormData: any): Observable<any> {
    return this.httpClient.post(`${this.serverUrl}/login`, loginFormData).pipe(catchError((err) => err
    ));
  }

  getUser() {
    const headers = new HttpHeaders({
      'authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
    return this.httpClient.get(`${this.serverUrl}/user`, { headers })
  }

  addToUsersConnection(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'authorization': `Bearer ${sessionStorage.getItem('token')}`
    })

    return this.httpClient.patch(`${this.serverUrl}/user/addToConnection`, { email: email }, { headers })
  }

  UpdateUserDetails(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
    return this.httpClient.post(`${this.serverUrl}/user/updateProfile`, formData, { headers })
  }

  getSelectedUser(id: string): Observable<any> {
    const headers = new HttpHeaders({
      'authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
    return this.httpClient.get(`${this.serverUrl}/user/${id}`, { headers })
  }



}
