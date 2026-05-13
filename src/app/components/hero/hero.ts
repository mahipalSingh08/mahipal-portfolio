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

  @ViewChild('orbitSystem', { static: false })
  orbitSystemRef!: ElementRef<HTMLDivElement>;

  typingText = signal('');
  heroTitleText = signal('');
  isMobile = signal(this.mobileMediaQuery.matches);

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

  /** Click-drag tilt state */
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private currentRotateX = 0;
  private currentRotateY = 0;
  private returnAnimId = 0;

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
    this.setupOrbitDrag();
    this.ngZone.runOutsideAngular(() => {
      this.animateBg();
      window.addEventListener('resize', this.resizeHandler);
    });

    /* Start typing after loader finishes */
    this.typingTimer = setTimeout(() => this.typeEffect(), 1800);
    this.heroTitleTimer = setTimeout(() => this.typeHeroTitle(0), 1200);
  }

  ngOnDestroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.animationId);
    cancelAnimationFrame(this.returnAnimId);
    window.removeEventListener('resize', this.resizeHandler);
    this.removeOrbitDrag();
    this.mobileMediaQuery?.removeEventListener('change', this.mobileMediaQueryHandler);
    if (this.typingTimer) clearTimeout(this.typingTimer);
    if (this.heroTitleTimer) clearTimeout(this.heroTitleTimer);
  }

  /* ---- Click-drag tilt ---- */

  private getOrbitEl(): HTMLDivElement | null {
    return this.orbitSystemRef?.nativeElement ?? null;
  }

  private applyRotation(x: number, y: number) {
    const el = this.getOrbitEl();
    if (el) {
      el.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    }
  }

  private setupOrbitDrag() {
    const el = this.getOrbitEl();
    if (!el) return;

    /* ---- Click-drag ---- */
    el.addEventListener('mousedown', (e: MouseEvent) => {
      e.preventDefault();
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      el.classList.add('dragging');
      cancelAnimationFrame(this.returnAnimId);
      this.returnAnimId = 0;
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      this.currentRotateY = Math.max(-20, Math.min(20, dx * 0.3));
      this.currentRotateX = Math.max(-20, Math.min(20, -dy * 0.3));
      this.applyRotation(this.currentRotateX, this.currentRotateY);
    });

    const endDrag = () => {
      if (!this.isDragging) return;
      this.isDragging = false;
      el.classList.remove('dragging');
      this.animateReturn();
    };

    window.addEventListener('mouseup', endDrag);

    /* Store handlers for cleanup */
    (el as any).__dragCleanup = () => {
      el.removeEventListener('mousedown', (el as any).__dragCleanup);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('mousemove', (el as any).__dragCleanup);
    };
  }

  private removeOrbitDrag() {
    const el = this.getOrbitEl();
    if (el && (el as any).__dragCleanup) {
      (el as any).__dragCleanup();
      delete (el as any).__dragCleanup;
    }
  }

  private animateReturn() {
    const step = () => {
      const speed = 0.10;
      this.currentRotateX += (0 - this.currentRotateX) * speed;
      this.currentRotateY += (0 - this.currentRotateY) * speed;

      this.applyRotation(this.currentRotateX, this.currentRotateY);

      if (Math.abs(this.currentRotateX) > 0.05 || Math.abs(this.currentRotateY) > 0.05) {
        this.returnAnimId = requestAnimationFrame(step);
      } else {
        this.currentRotateX = 0;
        this.currentRotateY = 0;
        this.applyRotation(0, 0);
        this.returnAnimId = 0;
      }
    };
    this.returnAnimId = requestAnimationFrame(step);
  }

  /* ---- Canvas particles ---- */
  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.W = canvas.width = window.innerWidth;
    this.H = canvas.height = window.innerHeight;

    for (let i = 0; i < 100; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#a78bfa'];
    return {
      x: Math.random() * this.W,
      y: Math.random() * this.H,
      r: Math.random() * 2 + 0.3,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
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
        if (dist < 130) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          /* gradient stroke based on particle colors */
          const grad = this.ctx.createLinearGradient(
            this.particles[i].x, this.particles[i].y,
            this.particles[j].x, this.particles[j].y
          );
          grad.addColorStop(0, this.particles[i].color);
          grad.addColorStop(1, this.particles[j].color);
          this.ctx.strokeStyle = grad;
          this.ctx.globalAlpha = (1 - dist / 130) * 0.15;
          this.ctx.lineWidth = 1.0;
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