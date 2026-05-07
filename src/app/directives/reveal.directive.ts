import { Directive, ElementRef, inject, input, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;

  /** Stagger delay in ms */
  delay = input(0);

  ngAfterViewInit() {
    const element = this.el.nativeElement;
    element.classList.add('reveal');

    const delayMs = this.delay();
    if (delayMs > 0) {
      element.style.transitionDelay = `${delayMs}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), 80);
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
