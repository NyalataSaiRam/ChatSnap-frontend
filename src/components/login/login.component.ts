import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { OverlayComponent } from '../overlay/overlay.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterLink, ReactiveFormsModule, OverlayComponent ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  @ViewChild('eyeicon') ei!: ElementRef;
  @ViewChild('passwordInput') pi!: ElementRef;

  loginForm!: FormGroup;
  errorMsg: string = 'sdafsffd';
  showOverlay: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,

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

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [ '', [ Validators.email, Validators.required ] ],
      password: [ '', [ Validators.minLength(6), Validators.required ] ],
    })
  }



  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        sessionStorage.setItem('token', res.token)

        this.router.navigate([ '/home' ])
      },
      error: (err) => {
        this.errorMsg = "Invalid Credentials";
        this.showOverlay = true
      }
    })
  }

}
