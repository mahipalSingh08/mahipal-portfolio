import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  private fb = inject(FormBuilder);

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  submitText = signal('Send Message →');
  submitStatus = signal<'idle' | 'success' | 'error'>('idle');

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

    // TODO: Wire up to backend API
    const formData = this.contactForm.value;
    console.log('Form submitted:', formData);

    this.submitStatus.set('success');
    this.submitText.set('✓ Message Sent!');
    setTimeout(() => {
      this.submitStatus.set('idle');
      this.submitText.set('Send Message →');
      this.contactForm.reset();
    }, 3500);
  }
}
