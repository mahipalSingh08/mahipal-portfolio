import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  
  userId = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  @Output() loginSuccess = new EventEmitter<void>();

  onSubmit() {
    if (!this.userId || !this.password) {
      this.errorMessage = 'Please enter both user ID and password';
      return;
    }
    
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.userId, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginSuccess.emit();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
