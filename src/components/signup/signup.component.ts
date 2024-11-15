import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { OverlayComponent } from '../overlay/overlay.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, OverlayComponent ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  @ViewChild('eyeicon') ei!: ElementRef;
  @ViewChild('passwordInput') pi!: ElementRef;
  @ViewChild('eyeicon2') ei2!: ElementRef;
  @ViewChild('passwordInput2') pi2!: ElementRef;

  signupForm!: FormGroup;
  successMsg: string = 'sdfsdfsdfsd';
  errorMsg: string = 'sdafsffd';
  showOverlay: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  toggleEye() {
    this.pi.nativeElement.type = this.pi.nativeElement.type === 'password' ? 'text' : 'password';
    if (this.pi.nativeElement.type !== 'password') {
      this.ei.nativeElement.classList.add('fa-eye');
      this.ei.nativeElement.classList.remove('fa-eye-slash');
    } else {
      this.ei.nativeElement.classList.add('fa-eye-slash');
      this.ei.nativeElement.classList.remove('fa-eye');

    }
  }
  toggleEye2() {
    this.pi2.nativeElement.type = this.pi2.nativeElement.type === 'password' ? 'text' : 'password';
    if (this.pi2.nativeElement.type !== 'password') {
      this.ei2.nativeElement.classList.add('fa-eye');
      this.ei2.nativeElement.classList.remove('fa-eye-slash');
    } else {
      this.ei2.nativeElement.classList.add('fa-eye-slash');
      this.ei2.nativeElement.classList.remove('fa-eye');

    }
  }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      fullname: [ '', [ Validators.minLength(3), Validators.required ] ],
      email: [ '', [ Validators.email, Validators.required ] ],
      password: [ '', [ Validators.minLength(6), Validators.required ] ],
      confirmPassword: [ '', [ Validators.minLength(6), Validators.required ] ],
    }, { validators: this.validatePasswords })
  }

  validatePasswords(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { invalidPasswords: true };
  }
  signUp() {
    this.authService.signUp(this.signupForm.value).subscribe({
      next: (res) => {
        this.successMsg = `${res.message}\nPlease login with your credentials`
        this.showOverlay = true
        this.signupForm.reset()
      },
      error: (err) => {
        this.errorMsg = err.error
        this.signupForm.reset()
      }
    })
  }

}
