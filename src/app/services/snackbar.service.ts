import { Injectable, signal } from '@angular/core';

export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarState {
  message: string;
  type: SnackbarType;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _state = signal<SnackbarState>({
    message: '',
    type: 'info',
    visible: false,
  });

  readonly state = this._state.asReadonly();

  private _timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: SnackbarType = 'info', duration = 4000): void {
    // Clear any existing timer
    if (this._timer) {
      clearTimeout(this._timer);
    }

    this._state.set({ message, type, visible: true });

    this._timer = setTimeout(() => {
      this.dismiss();
    }, duration);
  }

  dismiss(): void {
    this._state.update((s) => ({ ...s, visible: false }));
  }
}
