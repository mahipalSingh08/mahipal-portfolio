import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SnackbarService } from './snackbar.service';

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

export interface Reaction {
  reaction: string;
  total: number;
  emailCount: number;
}

export interface ReactionResponse {
  _id: string | null;
  reactions: Reaction[];
  grandTotal: number;
  grandEmailCount: number;
}

export interface ReactionEmail {
  email: string;
  name: string;
  created_at: string;
}

export interface ReactionEmailResponse {
  data: ReactionEmail[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

// ─── API Service ────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private snackbar = inject(SnackbarService);
  private readonly baseUrl = environment.apiBaseUrl;

  // ── Health Check ────────────────────────────────────────────────────────

  /**
   * GET /health
   * Checks if the Python backend is up and running.
   */
  checkHealth(): Observable<HealthCheckResponse> {
    return this.http
      .get<HealthCheckResponse>(`${this.baseUrl}/health`)
      .pipe(retry(1), catchError((err) => this.handleError(err)));
  }

  // ── Contact Endpoints ───────────────────────────────────────────────────
  submitContact(data: { name: string; email: string; query: string }): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/api/contact`, data)
      .pipe(catchError((err) => this.handleError(err)));
  }

  getContacts(page: number = 1, limit: number = 10): Observable<ContactResponse> {
    return this.http
      .get<ContactResponse>(`${this.baseUrl}/api/contacts?page=${page}&limit=${limit}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  deleteContacts(ids: string[]): Observable<DeleteResponse> {
    return this.http
      .delete<DeleteResponse>(`${this.baseUrl}/api/contacts`, { body: { ids } })
      .pipe(catchError((err) => this.handleError(err)));
  }

  // ── Reaction Endpoints ────────────────────────────────────────────────

  /**
   * GET /api/reaction
   * Fetches all reactions with statistics.
   */
  getReactions(): Observable<ReactionResponse> {
    return this.http
      .get<ReactionResponse>(`${this.baseUrl}/api/reaction`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * GET /api/reaction/{react}
   * Fetches unique user reactions with pagination.
   */
  getReactionEmails(reactionType: string, page: number = 1, limit: number = 5): Observable<ReactionEmailResponse> {
    return this.http
      .get<ReactionEmailResponse>(`${this.baseUrl}/api/reaction/${reactionType}?page=${page}&limit=${limit}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * POST /api/reaction
   * Submits a user reaction (feedback).
   */
  submitReaction(data: { reaction: string; email: string; name: string }): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.baseUrl}/api/reaction`, data)
      .pipe(catchError((err) => this.handleError(err)));
  }

  // ── Error Handler ────────────────────────────────────────────────────────

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred.';

    if (error.status === 0) {
      // Network / CORS error — backend likely offline
      errorMessage = `Cannot reach the backend server. Make sure it is running at ${environment.apiBaseUrl}`;
    } else if (error.status === 429) {
      // Rate limiting — too many requests
      errorMessage = 'You’ve made too many requests in a short time. Please wait sometime.';
      this.snackbar.show(errorMessage, 'info', 5000);
    } else if (error.status === 400 && error?.error?.detail === "Query contains inappropriate language. Please remove offensive words.") {
      errorMessage = error.error.detail;
      this.snackbar.show(errorMessage, 'error', 5000);
    }else {
      // Backend returned a non-2xx response
      console.log('[ApiService] Backend error response:', error);
      errorMessage = error.error?.message ?? error.message ?? errorMessage;
      this.snackbar.show(errorMessage, 'error', 5000);
    }

    console.error('[ApiService]', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
