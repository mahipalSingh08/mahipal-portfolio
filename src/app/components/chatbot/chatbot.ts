import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  AfterViewInit,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { ChatMessage, ChatHistoryMessage, SuggestedPrompt } from '../../models/chat';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class ChatbotComponent implements OnInit, AfterViewInit, OnDestroy {
  private chatbotService = inject(ChatbotService);
  private subscription?: Subscription;

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInputRef!: ElementRef<HTMLTextAreaElement>;


  readonly isOpen = signal(false);
  readonly showChatbot = signal(false);
  readonly messages = signal<ChatMessage[]>([]);
  readonly isLoading = signal(false);
  readonly inputText = signal('');
  private persistTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly welcomeMessage: ChatMessage = {
    role: 'ai',
    content:
      '👋 Hello! I am **Virtual Mahipal Singh**, an AI-powered version of Mahipal. Ask me anything about his skills, projects, experience, or background!',
    timestamp: new Date(),
  };

  readonly suggestedPrompts: SuggestedPrompt[] = [
    { label: 'About Me', text: 'Tell me about yourself' },
    { label: 'Projects', text: 'What projects have you built?' },
    { label: 'AI Skills', text: 'Explain your AI skills' },
    { label: 'Tech Stack', text: 'Show your tech stack' },
    { label: 'Resume 📩', text: 'Download Resume' },
  ];

  ngOnInit(): void {
    /* Restore conversation history from localStorage so previous chat survives page reload */
    const saved = this.chatbotService.loadMessages();
    if (saved.length > 0) {
      this.messages.set(saved);
    }

    /* If we have a session_id, try to fetch the official history from the backend to stay in sync */
    this.restoreBackendHistory();
  }

  ngAfterViewInit(): void {
    /* After 10 seconds, slide the chatbot in from the right */
    setTimeout(() => {
      this.showChatbot.set(true);
    }, 10000);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.persistTimeout) {
      clearTimeout(this.persistTimeout);
    }
  }

  /** Debounced persist — writes messages to localStorage after a short pause so we don't write on every tiny update. */
  private persistMessages(): void {
    if (this.persistTimeout) {
      clearTimeout(this.persistTimeout);
    }
    this.persistTimeout = setTimeout(() => {
      this.chatbotService.saveMessages(this.messages());
    }, 300);
  }

  /**
   * If a session already exists, fetch the backend's stored history
   * and merge it into the local messages (only if we have none).
   */
  private restoreBackendHistory(): void {
    if (!this.chatbotService.getSessionId()) return;
    /* If we already restored from localStorage, don't overwrite */
    if (this.messages().length > 1) return;

    this.subscription?.unsubscribe();
    this.subscription = this.chatbotService.getHistory().subscribe({
      next: (history) => {
        if (history.messages.length === 0) return;
        const converted: ChatMessage[] = history.messages.map((m: ChatHistoryMessage) => ({
          role: m.role === 'assistant' ? 'ai' : 'user',
          content: m.content,
          timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
        }));
        /* Prepend welcome message then append backend history */
        this.messages.set([this.welcomeMessage, ...converted]);
        this.persistMessages();
        this.scrollToBottom();
      },
      error: () => {
        /* Silently ignore — localStorage fallback is fine */
      },
    });
  }

  /** Reset the conversation on both the backend and locally. */
  resetConversation(): void {
    this.subscription?.unsubscribe();

    /* Reset backend session */
    if (this.chatbotService.getSessionId()) {
      this.subscription = this.chatbotService.resetHistory().subscribe({
        next: () => {
          this.chatbotService.setSessionId(null);
          this.chatbotService.clearMessages();
          this.messages.set([this.welcomeMessage]);
          this.isLoading.set(false);
        },
        error: () => {
          /* Even if the backend call fails, clear locally */
          this.chatbotService.setSessionId(null);
          this.chatbotService.clearMessages();
          this.messages.set([this.welcomeMessage]);
          this.isLoading.set(false);
        },
      });
    } else {
      this.chatbotService.clearMessages();
      this.messages.set([this.welcomeMessage]);
      this.isLoading.set(false);
    }
  }

  toggleChat(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      /* Add welcome message if no messages yet */
      if (this.messages().length === 0) {
        this.messages.set([this.welcomeMessage]);
      }
      /* Focus input after modal opens */
      setTimeout(() => {
        this.focusInput();
        this.scrollToBottom();
      }, 350);
    }
  }

  selectPrompt(prompt: SuggestedPrompt): void {
    if (prompt.text === 'Download Resume') {
      this.downloadResume();
      return;
    }
    this.inputText.set(prompt.text);
    this.sendMessage();
  }

  private downloadResume(): void {
    const link = document.createElement('a');
    link.href = 'assets/MahipalSingh_FullStack_AI_Resume.pdf';
    link.download = 'MahipalSingh_FullStack_AI_Resume.pdf';
    link.click();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    const text = this.inputText().trim();
    if (!text || this.isLoading()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, userMessage]);
    this.persistMessages();
    this.inputText.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    this.subscription?.unsubscribe();
    this.subscription = this.chatbotService.sendMessage(text).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.session_id) {
          this.chatbotService.setSessionId(res.session_id);
        }
        const aiMessage: ChatMessage = {
          role: 'ai',
          content: res.response,
          timestamp: new Date(),
        };
        this.messages.update((msgs) => [...msgs, aiMessage]);
        this.persistMessages();
        this.scrollToBottom();
      },
      error: (err) => {
        this.isLoading.set(false);
        const errorMsg = err instanceof Error ? err.message : 'Failed to get AI response.';
        const aiMessage: ChatMessage = {
          role: 'ai',
          content: `😔 ${errorMsg}`,
          timestamp: new Date(),
        };
        this.messages.update((msgs) => [...msgs, aiMessage]);
        this.persistMessages();
        this.scrollToBottom();
      },
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesRef?.nativeElement) {
        const el = this.chatMessagesRef.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 50);
  }

  private focusInput(): void {
    setTimeout(() => {
      this.messageInputRef?.nativeElement?.focus();
    }, 50);
  }

  trackByFn(_index: number, message: ChatMessage): string {
    return `${message.role}-${message.timestamp.getTime()}`;
  }
}
