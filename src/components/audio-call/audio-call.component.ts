import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { interval, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-audio-call',
  standalone: true,
  imports: [ DatePipe, AsyncPipe ],
  templateUrl: './audio-call.component.html',
  styleUrl: './audio-call.component.css'
})
export class AudioCallComponent {
  @Input() audiostream!: any;
  @Input() user!: any;
  imageurl = environment.url + '/images/'
  // @ViewChild('remoteAudio') audioElement!: ElementRef;

  @Output() hangCall = new EventEmitter()

  hangup() {
    this.hangCall.emit()
  }

  minutes: string = '00';
  timer$!: Observable<{ minutes: string, seconds: string }>;

  ngOnInit(): void {
    this.timer$ = interval(1000).pipe(
      map(seconds => {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return { minutes, seconds: sec };
      })
    );
  }



}
