import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  profileForm!: FormGroup;
  fileError!: String;
  serverUrl = environment.url + "/images/"
  formData: FormData = new FormData();

  @ViewChild('image') fI!: ElementRef;

  @Input() userDetails!: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  @Output() closeSettingsDialog = new EventEmitter()
  closeSettings() {
    this.closeSettingsDialog.emit()
  }
  @Output() settingsUpdated = new EventEmitter()
  settingsUpdatedEvent() {
    this.settingsUpdated.emit()
  }

  submitForm() {
    this.formData.append('userDetails', JSON.stringify(this.profileForm.value))
    this.authService.UpdateUserDetails(this.formData).subscribe((res: any) => {
      this.userDetails = res
      console.log(this.userDetails)
      // console.log(imageUrl+user?.profilePic)
      this.settingsUpdatedEvent()
      this.closeSettings()
    })
  }

  onFileChange(event: any) {
    const file = event.currentTarget.files[ 0 ];

    // Reset fileError on every file selection
    this.fileError = '';

    // Check if file exists
    if (file) {

      let imageUrl = URL.createObjectURL(file); // Create an object URL for the selected file

      if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
        if (file.size < 3000000) {
          // If file is valid, append to FormData
          this.formData.append('file', file);

          // Set the image src to the newly created object URL
          this.fI.nativeElement.src = imageUrl;

          // Optional: You can now proceed with uploading the formData (if needed)
        } else {
          // File size validation
          this.fileError = "File size should be less than 3MB";
          URL.revokeObjectURL(imageUrl);  // Revoke object URL to free up memory
        }
      } else {
        // File type validation
        this.fileError = "File type should be [jpg, jpeg, png]";
        URL.revokeObjectURL(imageUrl);  // Revoke object URL to free up memory
      }

      // If there's an error, display the message for 2 seconds
      if (this.fileError.length > 0) {
        setTimeout(() => {
          this.fileError = '';
        }, 2000);
      }
    }
  }


  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      fullname: [ this.userDetails?.fullname ],
      email: [ this.userDetails?.email ],
      gender: [ this.userDetails?.gender ],
      age: [ this.userDetails?.age ],
      profession: [ this.userDetails?.profession ],
      description: [ this.userDetails?.description ],
    })

  }


}
