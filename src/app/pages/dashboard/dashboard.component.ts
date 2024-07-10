import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  token: string | null = '';

  constructor(private tokenService: TokenService, private router: Router) { }
  logout() {
    this.tokenService.logout();
    // Sau khi logout, chuyển hướng về trang login hoặc trang chính
    this.router.navigate(['auth/login']); // Điều chỉnh đường dẫn nếu cần
  }
}
