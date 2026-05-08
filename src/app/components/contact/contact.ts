import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    query: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
  });

  submitText = signal('Send Message →');
  submitStatus = signal<'idle' | 'success' | 'error' | 'loading'>('idle');

  ngOnInit() {
    this.apiService.checkHealth().subscribe({
      next: () => this.isBackendReady.set(true),
      error: () => this.isBackendReady.set(false)
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.submitStatus.set('error');
      this.submitText.set('⚠ Please fill all fields');
      setTimeout(() => {
        this.submitStatus.set('idle');
        this.submitText.set('Send Message →');
      }, 2500);
      return;
    }

    this.submitStatus.set('loading');
    this.submitText.set('Sending...');

    const formData = this.contactForm.value as {name: string, email: string, query: string};
    
    this.apiService.submitContact(formData).subscribe({
      next: () => {
        this.submitStatus.set('success');
        this.submitText.set('✓ Message Sent!');
        setTimeout(() => {
          this.submitStatus.set('idle');
          this.submitText.set('Send Message →');
          this.contactForm.reset();
        }, 3500);
      },
      error: () => {
        this.submitStatus.set('error');
        this.submitText.set('⚠ Failed to send message');
        setTimeout(() => {
          this.submitStatus.set('idle');
          this.submitText.set('Send Message →');
        }, 3500);
      }
    });
  }
}
