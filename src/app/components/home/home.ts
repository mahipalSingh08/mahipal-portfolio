import { Component, OnInit, OnDestroy, NgZone, inject } from '@angular/core';
import { LoaderComponent } from '../loader/loader';
import { NavbarComponent } from '../navbar/navbar';
import { HeroComponent } from '../hero/hero';
import { AboutComponent } from '../about/about';
import { SkillsComponent } from '../skills/skills';
import { ProjectsComponent } from '../projects/projects';
import { ExperienceComponent } from '../experience/experience';
import { CertificationsComponent } from '../certifications/certifications';
import { ContactComponent } from '../contact/contact';
import { FooterComponent } from '../footer/footer';
import { BackToTopComponent } from '../back-to-top/back-to-top';
import { ChatbotComponent } from '../chatbot/chatbot';
import { ApiService } from '../../services/api.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoaderComponent,
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    CertificationsComponent,
    ContactComponent,
    FooterComponent,
    BackToTopComponent,
    ChatbotComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private ngZone = inject(NgZone);
  private apiService = inject(ApiService);
  private snackbarService = inject(SnackbarService);
  private glow!: HTMLDivElement;

  private mouseMoveHandler = (e: MouseEvent) => {
    this.glow.style.left = e.clientX + 'px';
    this.glow.style.top = e.clientY + 'px';
  };

  scrollProgress = 0;

  private scrollHandler = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    this.scrollProgress = (scrollTop / docHeight) * 100;
  };

  ngOnInit() {
    /* ── Backend health check ── */
    this.apiService.checkHealth().subscribe({
      next: (res) => {
        console.log(
          '%c✅ Connection with Python backend is success',
          'color: #22c55e; font-weight: bold; font-size: 13px;',
          res
        );
      },
      error: (err) => {
        console.error('❌ Backend connection failed:', err.message);
        this.snackbarService.show(
          'Backend connection failed. Please ensure the Python server is running.',
          'error',
          6000
        );
      },
    });

    /* Cursor glow */
    this.glow = document.createElement('div');
    this.glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9998;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.5s ease, top 0.5s ease;
      will-change: left, top;
    `;
    document.body.appendChild(this.glow);

    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this.mouseMoveHandler);
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    });
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('scroll', this.scrollHandler);
    if (this.glow?.parentNode) {
      this.glow.parentNode.removeChild(this.glow);
    }
  }
}
