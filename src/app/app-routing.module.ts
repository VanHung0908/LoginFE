import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { AuthGuard } from './guard/auth.guard';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/register', component: SignupComponent },
    {
        path: '',
        component: LayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', component: ProfileComponent },
        ]
    },
    { path: '**', component:NotfoundComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
