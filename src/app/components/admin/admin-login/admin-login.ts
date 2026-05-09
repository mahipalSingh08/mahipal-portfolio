import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLoginComponent {
  userId = '';
  password = '';
  errorMessage = '';

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.errorMessage = '';
    const success = this.authService.login(this.userId, this.password);
    if (success) {
      this.loginSuccess.emit();
    } else {
      this.errorMessage = 'Invalid credentials. Use admin / admin';
    }
  }
}
