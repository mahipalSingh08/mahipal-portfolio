import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject,
  signal,
} from '@angular/core';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}

interface OrbitalParticle {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private ngZone = inject(NgZone);
  private mobileMediaQuery = window.matchMedia('(max-width: 767px)');

  @ViewChild('bgCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('scene3d', { static: false })
  scene3dRef!: ElementRef<HTMLDivElement>;

  typingText = signal('');
  heroTitleText = signal('');
  isMobile = signal(this.mobileMediaQuery.matches);

  orbitalParticles: OrbitalParticle[] = [];

  private ctx!: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private particles: Particle[] = [];
  private animationId = 0;
  private resizeHandler = () => this.onResize();
  private mobileMediaQueryHandler = (event: MediaQueryListEvent) => {
    this.isMobile.set(event.matches);
  };
  private destroyed = false;

  /* Mouse parallax for 3D orbit */
  private mouseX = 0;
  private mouseY = 0;
  private targetRotateX = 0;
  private targetRotateY = 0;
  private currentRotateX = 0;
  private currentRotateY = 0;
  private mouseMoveHandler = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };
  private parallaxRAF = 0;

  /* Typing state */
  private typingPhrases = [
    'I build AI agents',
    'I automate workflows',
    'I create intelligent systems',
    'I design RAG pipelines',
    'I develop LLM applications',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimer: ReturnType<typeof setTimeout> | null = null;
  private heroTitleTimer: ReturnType<typeof setTimeout> | null = null;

  private heroTitleFull = 'AI Engineer \u00A0·\u00A0 Agentic AI Systems Builder';

  ngAfterViewInit() {
    this.mobileMediaQuery.addEventListener('change', this.mobileMediaQueryHandler);
    this.initCanvas();
    this.initOrbitalParticles();
    this.ngZone.runOutsideAngular(() => {
      this.animateBg();
      this.startParallax();
      window.addEventListener('resize', this.resizeHandler);
    });

    /* Start typing after loader finishes */
    this.typingTimer = setTimeout(() => this.typeEffect(), 1800);
    this.heroTitleTimer = setTimeout(() => this.typeHeroTitle(0), 1200);
  }

  ngOnDestroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animationId);
    cancelAnimationFrame(this.parallaxRAF);
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    this.mobileMediaQuery?.removeEventListener('change', this.mobileMediaQueryHandler);
    if (this.typingTimer) clearTimeout(this.typingTimer);
    if (this.heroTitleTimer) clearTimeout(this.heroTitleTimer);
  }

  /* ---- Orbital floating particles ---- */
  private initOrbitalParticles() {
    const particles: OrbitalParticle[] = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        id: i,
        x: Math.random() * 420,
        y: Math.random() * 420,
        z: (Math.random() - 0.5) * 200,
        size: Math.random() * 4 + 1.5,
        opacity: Math.random() * 0.4 + 0.1,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 3,
      });
    }
    this.orbitalParticles = particles;
  }

  /* ---- Mouse parallax ---- */
  private startParallax() {
    if (this.destroyed) return;
    const update = () => {
      if (this.destroyed) {
        cancelAnimationFrame(this.parallaxRAF);
        return;
      }

      const el = this.scene3dRef?.nativeElement;
      if (!el) {
        this.parallaxRAF = requestAnimationFrame(update);
        return;
      }

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      /* Map mouse position to -15..15 degree rotation */
      this.targetRotateY = ((this.mouseX - centerX) / rect.width) * 20;
      this.targetRotateX = ((this.mouseY - centerY) / rect.height) * -20;

      /* Smooth interpolation */
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.05;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.05;

      el.style.transform =
        `rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg)`;

      this.parallaxRAF = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', this.mouseMoveHandler);
    this.parallaxRAF = requestAnimationFrame(update);
  }

  /* ---- Canvas particles ---- */
  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.W = canvas.width = window.innerWidth;
    this.H = canvas.height = window.innerHeight;

    for (let i = 0; i < 80; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    return {
      x: Math.random() * this.W,
      y: Math.random() * this.H,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.7 ? '#818cf8' : '#38bdf8',
    };
  }

  private animateBg() {
    if (this.destroyed) return;
    this.ctx.clearRect(0, 0, this.W, this.H);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > this.W || p.y < 0 || p.y > this.H) {
        Object.assign(p, this.createParticle());
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }

    /* Connection lines */
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = '#38bdf8';
          this.ctx.globalAlpha = (1 - dist / 120) * 0.12;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
          this.ctx.globalAlpha = 1;
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.animateBg());
  }

  private onResize() {
    const canvas = this.canvasRef.nativeElement;
    this.W = canvas.width = window.innerWidth;
    this.H = canvas.height = window.innerHeight;
  }

  /* ---- Typing animations ---- */
  private typeEffect() {
    if (this.destroyed) return;
    const phrase = this.typingPhrases[this.phraseIndex];
    let speed: number;

    if (this.isDeleting) {
      this.charIndex--;
      speed = 40;
    } else {
      this.charIndex++;
      speed = 80;
    }

    this.typingText.set(phrase.substring(0, this.charIndex));

    if (!this.isDeleting && this.charIndex === phrase.length) {
      this.isDeleting = true;
      speed = 1500;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.typingPhrases.length;
      speed = 400;
    }

    this.typingTimer = setTimeout(() => this.typeEffect(), speed);
  }

  private typeHeroTitle(i: number) {
    if (this.destroyed) return;
    if (i < this.heroTitleFull.length) {
      this.heroTitleText.set(this.heroTitleFull.substring(0, i + 1));
      this.heroTitleTimer = setTimeout(() => this.typeHeroTitle(i + 1), 40);
    }
  }
}