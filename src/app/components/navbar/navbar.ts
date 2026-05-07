import { Component, inject, signal, HostListener } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private themeService = inject(ThemeService);

  mobileOpen = signal(false);
  scrolled = signal(false);
  activeSection = signal('hero');

  isDark = this.themeService.isDark;

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 30);

    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];
    let current = 'hero';
    
    for (const section of sections) {
      const el = document.getElementById(section);
      if (el && el.getBoundingClientRect().top <= 120) {
        current = section;
      }
    }
    this.activeSection.set(current);
  }

  toggleMobile() {
    this.mobileOpen.update((v) => !v);
  }

  closeMobile() {
    this.mobileOpen.set(false);
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  scrollTo(event: Event, sectionId: string) {
    event.preventDefault();
    this.closeMobile();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
