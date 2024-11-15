import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  @Input() userDetails: any;
  imageUrl: string = "http://localhost:8000/images/";

  @Output() closeProfile = new EventEmitter()
  closeProfileDialog() {
    this.closeProfile.emit()
  }
}
