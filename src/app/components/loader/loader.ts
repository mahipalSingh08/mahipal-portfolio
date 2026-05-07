import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class LoaderComponent {
  hidden = signal(false);

  constructor() {
    setTimeout(() => this.hidden.set(true), 1400);
  }
}
