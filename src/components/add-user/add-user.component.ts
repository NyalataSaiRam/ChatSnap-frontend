import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ FormsModule ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  @Output() closeAddUserDialog = new EventEmitter();
  @Output() newUserAdded = new EventEmitter();

  constructor(
    private authService: AuthService
  ) { }


  email!: string;
  emailRegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  addUser() {

    if (this.emailRegExp.test(this.email)) {
      this.authService.addToUsersConnection(this.email).subscribe((res: any) => {

        this.newUserAdded.emit()
      })
    }
  }

  closeAddUser() {
    this.closeAddUserDialog.emit();
  }
}

