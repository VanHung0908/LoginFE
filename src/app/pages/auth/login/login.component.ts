import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { environment } from '../../../../environments/environment';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, ButtonModule, ToastModule, PasswordModule],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginObj: Login;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private primeNGConfig: PrimeNGConfig,
    private tokenService: TokenService
  ) {
    this.loginObj = new Login();
  }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    const apiUrl = `${environment.apiHost}/auth/login`;
    this.http.post(apiUrl, this.loginObj)
      .subscribe({
        next: (res: any) => {
          console.log('Login Response:', res);
          if (res.status) {
            this.tokenService.setToken(res.token);
            localStorage.setItem('username', res.username); 
            this.primeNGConfig.ripple = true;
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: res.message
            });
            setTimeout(() => {
              this.router.navigateByUrl('/dashboard');
              window.location.reload();
            }, 1000);
          } else {
            this.primeNGConfig.ripple = true;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: res.message
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 429) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "You have sent too many requests. Please try again later after 5 minutes."
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "Email or Password is incorrect"
            });
          }
        }
      });
  }

  goToRegister() {
    this.router.navigateByUrl('auth/register');
  }
}

export class Login {
  email: string;
  password!: string;
  constructor() {
    this.email = '';
    this.password = '';
  }
}
