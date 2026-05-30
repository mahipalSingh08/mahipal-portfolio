import { Component, inject, signal, OnInit } from '@angular/core';
import confetti from 'canvas-confetti';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { RevealDirective } from '../../directives/reveal.directive';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  isBackendReady = signal<boolean>(false);
  isCheckingHealth = signal<boolean>(true);

  contactForm = this.fb.group({
    name: ['', [this.trimmedLengthValidator(3, 100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    query: ['', [this.trimmedLengthValidator(10, 1000)]],
    website: [''] //honeypot
  });

  submitText = signal('Send Message ->');
  submitStatus = signal<'idle' | 'success' | 'error' | 'loading'>('idle');
  private submitResetTimer: ReturnType<typeof setTimeout> | undefined;
  private hasTriggeredSilentWakeup = false;

  ngOnInit() {
    this.apiService.checkHealth().subscribe({
      next: () => {
        this.isBackendReady.set(true);
        this.isCheckingHealth.set(false);
      },
      error: () => {
        this.isBackendReady.set(false);
        this.isCheckingHealth.set(false);
      }
    });

    this.contactForm.valueChanges.subscribe(() => {
      if (!this.hasTriggeredSilentWakeup && this.isBackendReady()) {
        this.hasTriggeredSilentWakeup = true;
        this.apiService.wakeUpBackend();
      }

      clearTimeout(this.submitResetTimer);

      if (this.submitStatus() === 'error' && this.contactForm.invalid) {
        this.submitText.set('⚠️ ' + this.getValidationMessage());
        return;
      }

      if (this.submitStatus() === 'success' || this.submitStatus() === 'error') {
        this.submitStatus.set('idle');
        this.submitText.set('Send Message ->');
      }
    });
  }

  onSubmit() {
    if (this.submitStatus() === 'loading' || this.submitStatus() === 'success') {
      return;
    }

    // Honeypot detection:
    if (this.contactForm.controls.website.value?.trim()) {
      console.warn('[Honeypot] Bot detected — form submission blocked');
      // Simulate success to avoid alerting the bot
      this.submitStatus.set('success');
      this.submitText.set('✅ Message Sent!');
      this.submitResetTimer = setTimeout(() => {
        this.resetSubmitState();
        this.contactForm.reset();
      }, 3500);
      return;
    }

    if (this.contactForm.invalid) {
      clearTimeout(this.submitResetTimer);
      this.contactForm.markAllAsTouched();
      this.submitStatus.set('error');
      this.submitText.set(this.getValidationMessage());
      this.submitResetTimer = setTimeout(() => this.resetSubmitState(), 2500);
      return;
    }

    localStorage.setItem('email', this.contactForm.controls.email.value?.trim() ?? '');
    localStorage.setItem('name', this.contactForm.controls.name.value?.trim() ?? '');

    this.submitStatus.set('loading');
    this.submitText.set('⏳ Sending...');

    const formData = {
      name: this.contactForm.controls.name.value?.trim() ?? '',
      email: this.contactForm.controls.email.value?.trim() ?? '',
      query: this.contactForm.controls.query.value?.trim() ?? '',
    };

    this.apiService.submitContact(formData).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.submitText.set('✅ Message Sent!');
        this.hasTriggeredSilentWakeup = false;
        this.submitResetTimer = setTimeout(() => {
          this.resetSubmitState();
          this.contactForm.reset();
        }, 3500);
      },
      error: () => {
        this.submitStatus.set('error');
        this.submitText.set('❌ Failed to send message');
        this.submitResetTimer = setTimeout(() => this.resetSubmitState(), 3500);
      }
    });
  }

  private resetSubmitState(): void {
    this.submitStatus.set('idle');
    this.submitText.set('Send Message ->');
  }

  private trimmedLengthValidator(minLength: number, maxLength: number) {
    return (control: AbstractControl<string | null>): ValidationErrors | null => {
      const length = control.value?.trim().length ?? 0;

      if (length === 0) {
        return { required: true };
      }

      if (length < minLength) {
        return { minlength: { requiredLength: minLength, actualLength: length } };
      }

      if (length > maxLength) {
        return { maxlength: { requiredLength: maxLength, actualLength: length } };
      }

      return null;
    };
  }

  private getValidationMessage(): string {
    const name = this.contactForm.controls.name;
    const email = this.contactForm.controls.email;
    const query = this.contactForm.controls.query;

    if (name.hasError('required')) {
      return '⚠️ Name is required';
    }

    if (name.hasError('minlength')) {
      return '⚠️ Name must be at least 3 characters';
    }

    if (name.hasError('maxlength')) {
      return '⚠️ Name must be 100 characters or less';
    }

    if (email.hasError('required')) {
      return '⚠️ Email is required';
    }

    if (email.hasError('email')) {
      return '⚠️ Email is not valid';
    }

    if (email.hasError('maxlength')) {
      return '⚠️ Email must be 100 characters or less';
    }

    if (query.hasError('required')) {
      return '⚠️ Query is required';
    }

    if (query.hasError('minlength')) {
      return '⚠️ Query must be at least 10 characters';
    }

    if (query.hasError('maxlength')) {
      return '⚠️ Query must be 1000 characters or less';
    }

    return '⚠️ Please check the form fields';
  }

  onReactionClick(event: Event, label: string): void {
    const button = event.currentTarget as HTMLElement;

    // Bounce animation via CSS class (optional refresh)
    button.classList.add('bounce');
    setTimeout(() => button.classList.remove('bounce'), 200);

    // Small confetti burst from button position
    const rect = button.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { x, y },
      startVelocity: 12,
      colors: ['#ffd700', '#ff8c00', '#ff6b6b', '#4ecdc4'],
      decay: 0.8,
      ticks: 150
    });

    this.apiService.submitReaction({ reaction: label, email: localStorage.getItem('email') ?? '', name: localStorage.getItem('name') ?? '' }).subscribe({
      next: () => {
        console.log(`Reaction submitted successfully`);
      },
      error: () => {
        console.error(`Failed to submit reaction`);
      }
    })
  }
}
