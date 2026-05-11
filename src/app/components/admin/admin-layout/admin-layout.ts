import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AdminLoginComponent } from '../admin-login/admin-login';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AdminLoginComponent],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoggedIn = false;

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onLoginSuccess() {
    this.checkLoginStatus();
    this.router.navigate(['/admin/contact-dashboard']);
  }

  logout() {
    this.authService.logout();
    this.checkLoginStatus();
    this.router.navigate(['/admin']);
  }
}
