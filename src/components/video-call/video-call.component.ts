import { AfterContentInit, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [],
  templateUrl: './video-call.component.html',
  styleUrl: './video-call.component.css'
})
export class VideoCallComponent implements OnInit {
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  @ViewChild('localVideo') localVideo!: ElementRef;

  @Input() streams!: any[]

  @Output() hangCall = new EventEmitter()

  hangup() {
    this.hangCall.emit()
  }

  ngOnInit(): void {
    this.localVideo.nativeElement.srcObject = this.streams[ 0 ]
    this.remoteVideo.nativeElement.srcObject = this.streams[ 1 ]
  }


}
