import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ─── Response Interfaces ────────────────────────────────────────────────────

export interface HealthCheckResponse {
  status: string;
  message: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  query: string;
  created_at: string;
}

export interface ContactResponse {
  data: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface DeleteResponse {
  message: string;
  deleted_count: number;
}

// ─── API Service ────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  // ── Health Check ────────────────────────────────────────────────────────

  /**
   * GET /health
   * Checks if the Python backend is up and running.
   */
  checkHealth(): Observable<HealthCheckResponse> {
    return this.http
      .get<HealthCheckResponse>(`${this.baseUrl}/health`)
      .pipe(retry(1), catchError(this.handleError));
  }

  // ── Contact Endpoints ───────────────────────────────────────────────────
  submitContact(data: { name: string; email: string; query: string }): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/api/contact`, data)
      .pipe(catchError(this.handleError));
  }

  getContacts(page: number = 1, limit: number = 10): Observable<ContactResponse> {
    return this.http
      .get<ContactResponse>(`${this.baseUrl}/api/contacts?page=${page}&limit=${limit}`)
      .pipe(catchError(this.handleError));
  }

  deleteContacts(ids: string[]): Observable<DeleteResponse> {
    return this.http
      .delete<DeleteResponse>(`${this.baseUrl}/api/contacts`, { body: { ids } })
      .pipe(catchError(this.handleError));
  }

  // ── Error Handler ────────────────────────────────────────────────────────

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred.';

    if (error.status === 0) {
      // Network / CORS error — backend likely offline
      errorMessage = `Cannot reach the backend server. Make sure it is running at ${environment.apiBaseUrl}`;
    } else {
      // Backend returned a non-2xx response
      errorMessage = error.error?.message ?? error.message ?? errorMessage;
    }

    console.error('[ApiService]', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  public submitReaction(data: { reaction: string; email: string; name: string }): Observable<{ message: string }> {
    console.log(data);
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/api/reaction`, data)
      .pipe(catchError(this.handleError));
  }
}
