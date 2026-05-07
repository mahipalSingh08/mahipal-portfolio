import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<'dark' | 'light'>(this.getInitialTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    this.applyTheme(this._theme());
  }

  private getInitialTheme(): 'dark' | 'light' {
    if (typeof localStorage !== 'undefined') {
      return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  }

  private applyTheme(theme: 'dark' | 'light') {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggle() {
    const next = this._theme() === 'dark' ? 'light' : 'dark';
    this._theme.set(next);
    this.applyTheme(next);
    localStorage.setItem('theme', next);
  }
}
