import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  user_id: string;
  hash_password: string;
}

export interface LoginResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl;
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  login(userId: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { user_id: userId, hash_password: password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, loginData).pipe(
      tap((response: LoginResponse) => {
        localStorage.setItem('authToken', response.access_token);
        this.loggedInSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
