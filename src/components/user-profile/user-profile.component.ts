import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  @Input() userDetails: any;
  // imageUrl: string = "http://localhost:8000/images/";
  imageUrl = environment.url + "/images/"

  @Output() closeProfile = new EventEmitter()
  closeProfileDialog() {
    this.closeProfile.emit()
  }
}
