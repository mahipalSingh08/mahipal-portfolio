import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  constructor() {}

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(userId: string, password: string): boolean {
    if (userId === 'admin' && password === '9637') {
      this.loggedIn = true;
      return true;
    }
    return false;
  }

  logout(): void {
    this.loggedIn = false;
  }
}
