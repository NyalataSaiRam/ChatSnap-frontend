import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../../services/auth/auth.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { SettingsComponent } from '../settings/settings.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { CommonModule, DatePipe } from '@angular/common';
import { SocketioService } from '../../services/socketioConn/socketio.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message/message.service';
import { Subscription } from 'rxjs';
import Peer from 'peerjs';
import { VideoCallComponent } from '../video-call/video-call.component';
import { AudioCallComponent } from '../audio-call/audio-call.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterLink, AddUserComponent, SettingsComponent, UserProfileComponent, CommonModule, FormsModule, DatePipe, VideoCallComponent, AudioCallComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked {

  url = environment.url;
  imageUrl = this.url + "/images/";
  user: any;
  selectedUser: any;
  conversation: any[] = [];
  socketUsers: any[] = [];
  activeUsers: any[] = [];  // This keeps track of active users
  unreadMessages: any[] = []

  audioCallBtn = false;

  message: string = '';
  searchString: string = ''
  searchResult!: any[]

  peer!: Peer;
  localVideoStream!: MediaStream;
  remoteVideoStream!: MediaStream;
  localAudio!: MediaStream;
  remoteAudio!: MediaStream;
  callerUser!: any;
  calleeUser!: any;

  private subscriptions: Subscription[] = [];

  showAddUserDialogBox: boolean = false;
  showSettings: boolean = false;
  showProfile: boolean = false;
  showChatWindow: boolean = false;
  showChatList: boolean = true;

  call: any;
  showVideoCallDialogBox: boolean = false;
  showAudioCallDialogBox: boolean = false;
  callRejected: boolean = false;
  showVideo = false;
  showAudio = false
  recv = false;

  @ViewChild('messageContainer') msgContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private socket: SocketioService,
    private router: Router
  ) {

  }


  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.msgContainer) {
      this.msgContainer.nativeElement.scrollTop = this.msgContainer.nativeElement.scrollHeight;
    }
  }


  // Get the logged-in user
  getUser() {
    this.authService.getUser().subscribe((user: any) => {
      this.user = user;
      this.socket.socket.auth = { _id: this.user._id };
      this.socket.socket.connect();

      this.peer = new Peer(user._id)
    });
  }

  makeCall(id: string) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: MediaStream) => {
      this.localVideoStream = stream;

      this.call = this.peer.call(id, this.localVideoStream)
      // this.showVideo = true
      this.call.on('stream', (remoteStream: MediaStream) => {
        this.remoteVideoStream = remoteStream;
      })
      this.call.on('close', () => {
        this.showVideo = false
      })


    }).catch(err => console.log(err))
  }
  makeAudioCall(id: string) {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream: MediaStream) => {
      this.localAudio = stream;

      this.call = this.peer.call(id, this.localAudio)
      // this.showVideo = true
      this.call.on('stream', (remoteStream: MediaStream) => {
        this.remoteAudio = remoteStream;
      })
      this.call.on('close', () => {
        this.showAudio = false
      })


    }).catch(err => console.log(err))
  }

  handleVideoCallClick() {

    this.socket.emit('video call', this.selectedUser._id)
  }

  handleAudioCallClick() {
    this.audioCallBtn = true
    this.socket.emit('audio call', this.selectedUser._id)
  }

  handlereject() {
    console.log(this.callerUser._id)
    this.socket.emit('reject call', this.callerUser._id)
    this.showVideoCallDialogBox = false
    this.showAudioCallDialogBox = false
  }

  handleAnswer() {
    console.log(this.callerUser._id)
    this.socket.emit('answer call', this.callerUser._id)
    this.showVideoCallDialogBox = false
    this.showAudioCallDialogBox = false
  }
  handleaudioAnswer() {
    console.log(this.callerUser._id)
    this.socket.emit('answer audio call', this.callerUser._id)
    this.showVideoCallDialogBox = false
    this.showAudioCallDialogBox = false
  }

  hangupCall() {

    if (!this.recv) {

      this.call.close()
      this.showVideo = false
      this.showAudio = false
      window.location.reload()
    } else {
      this.socket.emit('hangUpTheCall', this.callerUser._id)
    }

  }

  search(name: any) {
    if (!name.length) {
      this.showChatList = true
    } else {
      this.showChatList = false
      this.searchResult = this.user.connections.filter((u: any) => {
        return u.fullname.toLowerCase().includes(name.toLowerCase());
      })
    }
  }

  // Select a user to start chatting
  selectChat(id: string) {
    this.selectedUser = null;
    this.showChatWindow = false;
    this.conversation = [];

    this.authService.getSelectedUser(id).subscribe((res: any) => {
      this.selectedUser = res.user;
      this.conversation = res.conversations;
      this.showChatWindow = true;
    });
  }

  // Send a message to the selected user
  sendMessage() {
    if (!this.selectedUser) return;
    const user = this.socketUsers.find(u => u.uid === this.selectedUser._id)
    if (user) {

      this.socket.emit('private message', {
        content: this.message,
        to: user.sid,
        receiverId: this.selectedUser._id
      });

    } else {
      this.socket.emit('private message', {
        content: this.message,
        to: null,
        receiverId: this.selectedUser._id
      });
    }
    this.message = '';  // Clear the input after sending the message
  }

  logout() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.socket.socket.disconnect();
    sessionStorage.removeItem('token')
    this.router.navigate([ '/login' ])
  }

  ngOnInit(): void {
    this.getUser();



    this.subscriptions.push(
      this.socket.on('users').subscribe((users) => {
        this.socketUsers = [ ...new Set(users) ];
        console.log(this.socketUsers)
      }),

      this.socket.on('active').subscribe((users) => {
        this.activeUsers = [ ...new Set(users) ];
        // console.log(this.socketUsers)
      }),

      this.socket.on('new user').subscribe((user) => {
        // console.log('new user connected')
        this.socketUsers = [ ...this.socketUsers, user ];
      }),

      this.socket.on('new active').subscribe((user) => {
        // console.log('new user connected')
        this.activeUsers = [ ...this.activeUsers, user ];
      }),

      this.socket.on('private message').subscribe((message) => {

        this.conversation = [ ...this.conversation, message ]
        // console.log(message)
      }),

      this.socket.on('user disconnected').subscribe(users => {
        this.socketUsers = [ ...new Set(users) ];
      }),
      this.socket.on('active disconnected').subscribe(users => {
        this.activeUsers = [ ...new Set(users) ];
      }),
      this.socket.on('callEvent').subscribe((callerId: string) => {

        this.showVideoCallDialogBox = true
        console.log('some is calling');

        this.callerUser = this.user.connections.find((u: any) => u._id === callerId)



        this.peer.on('call', (call) => {
          this.recv = true



          this.showVideo = true
          navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((localStream: MediaStream) => {
            this.localVideoStream = localStream;
            call.answer(this.localVideoStream);
            call.on('stream', (remoteStream: MediaStream) => {
              this.remoteVideoStream = remoteStream
            })
            call.on('close', () => {
              this.showVideo = false
              window.location.reload()
            })
          }).catch(err => console.log(err))

        })
      }),
      this.socket.on('AudioCallEvent').subscribe((callerId: string) => {

        this.showAudioCallDialogBox = true
        console.log('some is calling');

        this.callerUser = this.user.connections.find((u: any) => u._id === callerId)



        this.peer.on('call', (call) => {
          this.recv = true
          this.showAudio = true

          navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((localStream: MediaStream) => {
            this.localAudio = localStream;
            call.answer(this.localAudio);
            call.on('stream', (remoteStream: MediaStream) => {
              this.remoteAudio = remoteStream
            })
            call.on('close', () => {
              this.showAudio = false
              window.location.reload()
            })
          }).catch(err => console.log(err))
        })
      }),

      this.socket.on('rejectCallEvent').subscribe((calleeId: string) => {
        this.callRejected = true
        // console.log('some is calling');

        this.calleeUser = this.user.connections.find((u: any) => u._id === calleeId)

        setTimeout(() => {
          this.callRejected = false
          this.calleeUser = null

        }, 2000);
      }),

      this.socket.on('answerCallEvent').subscribe((calleeId: string) => {
        this.showVideo = true
        // console.log('some is calling');

        this.makeCall(calleeId)

        // this.calleeUser = this.user.connections.find((u: any) => u._id === calleeId)


      }),
      this.socket.on('answerAudioCallEvent').subscribe((calleeId: string) => {
        this.showAudio = true
        // console.log('some is calling');

        this.makeAudioCall(calleeId)

        // this.calleeUser = this.user.connections.find((u: any) => u._id === calleeId)


      }),

      this.socket.on('hangUpTheCallEvent').subscribe((calleeId: string) => {
        this.call.close()
        window.location.reload()
      }),



    );





  }

  ngOnDestroy(): void {
    // Unsubscribe from all socket events to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.socket.socket.disconnect();
  }
}

