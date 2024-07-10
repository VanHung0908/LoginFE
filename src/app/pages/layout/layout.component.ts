import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
})
export class LayoutComponent implements OnInit {
  activeLink: string = '';

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeLink = event.urlAfterRedirects;
      }
    });
  }

  navigateTo(path: string) {
    this.activeLink = `/${path}`;
    this.router.navigate([`/${path}`]);
  }

  isActive(link: string): boolean {
    return this.activeLink === `/${link}`;
  }

  logout() {
    this.tokenService.logout();
    this.router.navigate(['auth/login']);
  }
}
