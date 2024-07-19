import { Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('Token');
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('Token', token);
    }
  }
  logout() {
    // Xóa token từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // Xóa toàn bộ sessionStorage
    sessionStorage.clear();
  }
}
