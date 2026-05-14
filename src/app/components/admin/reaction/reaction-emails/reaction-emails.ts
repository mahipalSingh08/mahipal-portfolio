import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, ReactionEmail, ReactionEmailResponse } from '../../../../services/api.service';

@Component({
  selector: 'app-reaction-emails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reaction-emails.html',
  styleUrl: './reaction-emails.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionEmailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  reactionType: string = '';
  emails: ReactionEmail[] = [];
  currentPage = 1;
  pageSize = 5;
  totalPages = 0;
  totalEmails = 0;
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.reactionType = this.route.snapshot.paramMap.get('type') || '';
    if (!this.reactionType) {
      this.router.navigate(['/admin/reaction']);
      return;
    }
    this.loadEmails();
  }

  loadEmails(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.cdr.markForCheck();

    this.apiService.getReactionEmails(this.reactionType, this.currentPage, this.pageSize).subscribe({
      next: (response: ReactionEmailResponse) => {
        this.emails = response.data;
        this.totalEmails = response.pagination.total;
        this.totalPages = response.pagination.total_pages;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading reaction emails:', error);
        this.errorMessage = error.message || 'Failed to load emails';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadEmails();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadEmails();
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/reaction']);
  }
}
