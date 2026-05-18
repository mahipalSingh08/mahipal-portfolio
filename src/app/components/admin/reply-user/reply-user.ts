import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChatbotService } from '../../../services/chatbot.service';
import { SnackbarService } from '../../../services/snackbar.service';

export interface ChatSession {
  _id: string;
  session_id: string;
  created_at: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
}

@Component({
  selector: 'app-reply-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reply-user.html',
  styleUrl: './reply-user.css',
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReplyUserComponent implements OnInit {
  private chatbotService = inject(ChatbotService);
  private cdr = inject(ChangeDetectorRef);
  private snackbarService = inject(SnackbarService);

  chats: ChatSession[] = [];
  selectedSessionIds: Set<string> = new Set();

  currentPage: number = 1;
  limit: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  limits = [5, 10, 25];
  isLoading = false;

  showChatModal = false;
  selectedChat: ChatSession | null = null;

  ngOnInit() {
    this.loadChats();
  }

  loadChats() {
    console.log('loadChats called with page', this.currentPage, 'limit', this.limit);
    this.isLoading = true;
    this.cdr.markForCheck();
    this.chatbotService.getAllChats(this.currentPage, this.limit).subscribe({
      next: (res) => {
        console.log('Chat API response received:', res);
        this.chats = res.data;
        this.totalItems = res.pagination.total;
        this.totalPages = res.pagination.total_pages;
        this.currentPage = res.pagination.page;
        this.isLoading = false;
        this.selectedSessionIds.clear();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load chats ERROR:', err);
        this.isLoading = false;
        this.snackbarService.show('Failed to load chats', 'error');
        this.cdr.markForCheck();
      }
    });
  }

  toggleSelection(sessionId: string) {
    if (this.selectedSessionIds.has(sessionId)) {
      this.selectedSessionIds.delete(sessionId);
    } else {
      this.selectedSessionIds.add(sessionId);
    }
  }

  toggleAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.chats.forEach(c => this.selectedSessionIds.add(c.session_id));
    } else {
      this.selectedSessionIds.clear();
    }
  }

  isAllSelected() {
    return this.chats.length > 0 && this.selectedSessionIds.size === this.chats.length;
  }

  deleteSingle(sessionId: string) {
    if (confirm('Are you sure you want to delete this chat session?')) {
      this.chatbotService.deleteChat(sessionId).subscribe({
        next: () => {
          this.snackbarService.show('Chat session deleted successfully', 'success');
          this.loadChats();
        },
        error: (err) => {
          console.error('Failed to delete chat session', err);
          this.snackbarService.show('Failed to delete chat session', 'error');
        }
      });
    }
  }

  deleteSelected() {
    if (this.selectedSessionIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${this.selectedSessionIds.size} chat sessions?`)) {
      const deleteObservables = Array.from(this.selectedSessionIds).map(id => this.chatbotService.deleteChat(id));
      forkJoin(deleteObservables).subscribe({
        next: () => {
          this.snackbarService.show('Selected chat sessions deleted successfully', 'success');
          this.loadChats();
        },
        error: (err) => {
          console.error('Failed to delete some chat sessions', err);
          this.snackbarService.show('Failed to delete selected chat sessions', 'error');
          this.loadChats();
        }
      });
    }
  }

  changeLimit(event: Event) {
    this.limit = +(event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.loadChats();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadChats();
    }
  }

  openChatModal(chat: ChatSession) {
    this.selectedChat = chat;
    this.showChatModal = true;
    this.cdr.markForCheck();
  }

  closeChatModal() {
    this.showChatModal = false;
    this.selectedChat = null;
    this.cdr.markForCheck();
  }
}
