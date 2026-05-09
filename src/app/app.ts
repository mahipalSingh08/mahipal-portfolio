import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SnackbarComponent } from './components/snackbar/snackbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, SnackbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
}
