import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  url: string = environment.url
  socket!: Socket;

  constructor() {
    this.socket = io(this.url, { autoConnect: false })
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data)
  }

  on(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });

      // Handle cleanup
      return () => {
        this.socket.off(event);
      };
    });
  }
}
