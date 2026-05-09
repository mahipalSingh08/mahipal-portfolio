import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Contact } from '../../../services/api.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-contact-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-dashboard.html',
  styleUrl: './contact-dashboard.css',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactDashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private snackbarService = inject(SnackbarService);

  contacts: Contact[] = [];
  selectedIds: Set<string> = new Set();
  
  currentPage: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;
  
  limits = [5, 10, 25];
  isLoading = false;

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    console.log('loadContacts called with page', this.currentPage, 'limit', this.limit);
    this.isLoading = true;
    this.cdr.markForCheck();
    this.apiService.getContacts(this.currentPage, this.limit).subscribe({
      next: (res) => {
        console.log('API response received:', res);
        this.contacts = res.data;
        this.totalItems = res.pagination.total;
        this.totalPages = res.pagination.total_pages;
        this.currentPage = res.pagination.page;
        this.isLoading = false;
        this.selectedIds.clear();
        console.log('isLoading is now', this.isLoading);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load contacts ERROR:', err);
        this.isLoading = false;
        console.log('isLoading is now', this.isLoading);
        this.snackbarService.show('Failed to load contacts', "error");
        this.cdr.markForCheck();
      }
    });
  }

  toggleSelection(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.contacts.forEach(c => this.selectedIds.add(c._id));
    } else {
      this.selectedIds.clear();
    }
  }

  isAllSelected() {
    return this.contacts.length > 0 && this.selectedIds.size === this.contacts.length;
  }

  deleteSingle(id: string) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.apiService.deleteContacts([id]).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (err) => {
          console.error('Failed to delete contact', err);
          this.snackbarService.show('Failed to delete contact', "error");
        }
      });
    }
  }

  deleteSelected() {
    if (this.selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${this.selectedIds.size} contacts?`)) {
      this.apiService.deleteContacts(Array.from(this.selectedIds)).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (err) => {
          console.error('Failed to delete contacts', err);
          this.snackbarService.show('Failed to delete contacts', "error");
        }
      });
    }
  }

  changeLimit(event: Event) {
    this.limit = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadContacts();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadContacts();
    }
  }
}
