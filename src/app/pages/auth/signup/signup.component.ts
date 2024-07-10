import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CommonModule } from '@angular/common';  
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, ToastModule, PasswordModule],
  providers: [MessageService]
})
export class SignupComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient, 
    private messageService: MessageService, 
    private primeNGConfig: PrimeNGConfig
  ) {
    this.registerForm = this.fb.group({
      Username: ['', [Validators.required, this.noSpecialCharacters]],
      EmailId: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      ConfirmPassword: ['', Validators.required]
    });
    this.registerForm.get('ConfirmPassword')?.valueChanges.subscribe(() => {
      this.validatePassword();
    });
  }

  noSpecialCharacters(control: AbstractControl): { [key: string]: any } | null {
    const username = control.value;
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(username);
    if (hasSpecial) {
      return { hasSpecialCharacters: true };
    }
    return null;
  }

  passwordValidator(control: AbstractControl): { [key: string]: any } | null {
    const password = control.value;
    const hasNumber = /\d/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const valid = hasNumber && hasUpper && hasLower;
    if (!valid) {
      return { invalidPassword: true };
    }
    return null;
  }

  validatePassword() {
    const password = this.registerForm.get('Password')?.value;
    const confirmPassword = this.registerForm.get('ConfirmPassword')?.value;
    if (password && confirmPassword && password === confirmPassword) {
      this.registerForm.get('ConfirmPassword')?.setErrors(null);
    } else {
      this.registerForm.get('ConfirmPassword')?.setErrors({ mismatch: true });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const registerData = {
        name: this.registerForm.get('Username')?.value,
        email: this.registerForm.get('EmailId')?.value,
        password: this.registerForm.get('Password')?.value
      };
      
      const apiUrl = `${environment.apiHost}/auth/register`;
      this.http.post(apiUrl, registerData)
        .subscribe({
          next: (res: any) => {
            console.log('Register Response:', res);
            if (res.status) {
              this.primeNGConfig.ripple = true;
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: res.message
              });
              setTimeout(() => {
                this.router.navigateByUrl('auth/login');
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
            console.error('Register failed', error);
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: 'An error occurred during registration'
            });
          }
        });
    } else {
      console.log('Form not valid');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('auth/login');
  }
}
