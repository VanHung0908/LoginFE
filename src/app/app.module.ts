import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { ReactiveFormsModule ,FormsModule } from '@angular/forms'; 
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import {  provideHttpClient, withFetch } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { TokenService } from './services/token.service';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProfileComponent } from './pages/profile/profile.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NotfoundComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginComponent,
    FormsModule,
    LayoutComponent,
    ToastModule,
    RippleModule,
    ButtonModule,
    BrowserAnimationsModule,
    PasswordModule,
    SignupComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    MessageService,AuthGuard, TokenService,
    provideClientHydration(),
    provideHttpClient(withFetch())
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
