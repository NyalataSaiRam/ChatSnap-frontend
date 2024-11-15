import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  serverUrl: string = environment.url

  constructor(
    private http: HttpClient
  ) { }

  sendMessage(message: string, receiverId: string): Observable<any> {
    const headers = new HttpHeaders({
      'authorization': `Bearer ${sessionStorage.getItem('token')}`
    })
    return this.http.post(this.serverUrl + 'message', { message, receiverId }, { headers })
  }
}
