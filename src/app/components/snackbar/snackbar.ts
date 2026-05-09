import { Component, inject } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.html',
  styleUrl: './snackbar.css',
})
export class SnackbarComponent {
  protected snackbarService = inject(SnackbarService);
}
