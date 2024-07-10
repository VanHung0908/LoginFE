import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'your-app';

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }
}
