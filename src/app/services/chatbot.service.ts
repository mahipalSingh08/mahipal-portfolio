import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChatMessage, ChatHistoryResponse, ChatRequest, ChatResponse } from '../models/chat';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly SESSION_STORAGE_KEY = 'chat_session_id';
  private readonly MESSAGES_STORAGE_KEY = 'chat_messages';

  constructor() {
    /* Restore session_id from localStorage on service creation */
    const saved = localStorage.getItem(this.SESSION_STORAGE_KEY);
    this.sessionId = saved ?? null;
  }

  private sessionId: string | null = null;

  /** Standard non-streaming chat request. */
  sendMessage(message: string): Observable<ChatResponse> {
    const body: ChatRequest = {
      message,
      ...(this.sessionId ? { session_id: this.sessionId } : {}),
    };
    return this.http
      .post<ChatResponse>(`${this.baseUrl}/chat`, body)
      .pipe(catchError((err) => this.handleError(err)));
  }


  /** Fetch conversation history for the current session from the backend. */
  getHistory(): Observable<ChatHistoryResponse> {
    if (!this.sessionId) {
      return throwError(() => new Error('No active session.'));
    }
    return this.http
      .get<ChatHistoryResponse>(`${this.baseUrl}/chat/history/${this.sessionId}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** Reset the conversation on the backend for the current session. */
  resetHistory(): Observable<void> {
    if (!this.sessionId) {
      return throwError(() => new Error('No active session.'));
    }
    return this.http
      .delete<void>(`${this.baseUrl}/chat/history/${this.sessionId}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** Store the session_id returned by the backend so subsequent calls keep the same conversation context. */
  setSessionId(id: string | null): void {
    this.sessionId = id;
    if (id) {
      localStorage.setItem(this.SESSION_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(this.SESSION_STORAGE_KEY);
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  /* ---------- Message persistence ---------- */

  /** Save the conversation history to localStorage so it survives page reload. */
  saveMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(this.MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* localStorage quota may be exceeded — silently ignore */
    }
  }

  /** Load previously saved conversation history. Returns an empty array if none exists. */
  loadMessages(): ChatMessage[] {
    try {
      const raw = localStorage.getItem(this.MESSAGES_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { role: 'user' | 'ai'; content: string; timestamp: string }[];
      /* Rehydrate timestamp strings back to Date objects */
      return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
    } catch {
      return [];
    }
  }

  /** Clear the persisted conversation history. */
  clearMessages(): void {
    localStorage.removeItem(this.MESSAGES_STORAGE_KEY);
  }

  /** GET /chat/all — Retrieve all chat sessions with pagination. */
  getAllChats(page: number = 1, limit: number = 10): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/chat/all?page=${page}&limit=${limit}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /** DELETE /chat/history/{session_id} — Clear conversation history/delete chat session. */
  deleteChat(sessionId: string): Observable<any> {
    return this.http
      .delete<any>(`${this.baseUrl}/chat/history/${sessionId}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Sorry, I could not process your request. Please try again.';

    if (error.status === 0) {
      errorMessage = 'Cannot reach the server. Please ensure the backend is running.';
    } else if (error.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment before sending another message.';
    } else if (error.status === 500) {
      errorMessage = 'The server encountered an error. Please try again later.';
    } else if (error.error?.response) {
      errorMessage = error.error.response;
    } else if (error.error?.detail) {
      errorMessage = error.error.detail;
    }

    console.error('[ChatbotService] Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
