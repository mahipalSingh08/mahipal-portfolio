import { Component, OnDestroy, signal } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

type TechLogo = {
  name: string;
  src: string;
};

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './skills.html',
  styleUrl: './skills.css'
})
export class SkillsComponent implements OnDestroy {
  private mobileMediaQuery = window.matchMedia('(max-width: 767px)');
  isMobile = signal(this.mobileMediaQuery.matches);

  readonly techLogos: TechLogo[] = [
  { name: 'Python', src: 'assets/python.png' },
  { name: 'LangGraph', src: 'assets/langgraph.png' },
  { name: 'GitHub', src: 'assets/GitHub.png' },
  { name: 'Ollama', src: 'assets/ollama.png' },
  { name: 'CSS3', src: 'assets/CSS3.png' },
  { name: 'Jupyter', src: 'assets/Jupyter.png' },
  { name: 'MCP', src: 'assets/mcp.png' },
  { name: 'Angular', src: 'assets/Angular.png' },
  { name: 'FastAPI', src: 'assets/fastapi.png' },
  { name: 'Node.js', src: 'assets/Node.js.png' },
  { name: 'Hugging Face', src: 'assets/huggingface.png' },
  { name: 'Docker', src: 'assets/Docker.png' },
  { name: 'n8n', src: 'assets/n8n.png' },
  { name: 'VS Code', src: 'assets/vscode.png' },
  { name: 'OpenAI', src: 'assets/openai.png' },
  { name: 'Sass', src: 'assets/Sass.png' },
  { name: 'CrewAI', src: 'assets/crewai.png' },
  { name: 'MySQL', src: 'assets/MySQL.png' },
  { name: 'LangChain', src: 'assets/langchain.png' },
  { name: 'Git', src: 'assets/Git.png' },
  { name: 'Neo4j', src: 'assets/New4j.png' },
  { name: 'Gemini', src: 'assets/gemini.png' },
  { name: 'JavaScript', src: 'assets/JavaScript.png' },
  { name: 'Qdrant', src: 'assets/qdrant.png' },
  { name: 'Antigravity', src: 'assets/antigravity.png' },
  { name: 'MongoDB', src: 'assets/MongoDB.png' },
  { name: 'HTML5', src: 'assets/HTML5.png' },
  { name: 'Claude', src: 'assets/claude.png' },
  { name: 'DeepSeek', src: 'assets/deepseek.png' },
  { name: 'Cursor', src: 'assets/cursor.png' },
];

  dragOffset = 0;
  isDragging = false;
  activeLogoName = '';
  private dragStartX = 0;
  private tooltipTimer: ReturnType<typeof setTimeout> | undefined;
  private mobileMediaQueryHandler = (event: MediaQueryListEvent) => {
    this.isMobile.set(event.matches);
  };

  constructor() {
    this.mobileMediaQuery.addEventListener('change', this.mobileMediaQueryHandler);
  }

  ngOnDestroy(): void {
    this.mobileMediaQuery.removeEventListener('change', this.mobileMediaQueryHandler);
    clearTimeout(this.tooltipTimer);
  }

  startLogoDrag(event: PointerEvent): void {
    const carousel = event.currentTarget as HTMLElement;

    this.isDragging = true;
    this.dragOffset = this.wrapLogoDragOffset(this.dragOffset, carousel);
    this.dragStartX = event.clientX - this.dragOffset;
    carousel.setPointerCapture(event.pointerId);
  }

  moveLogoDrag(event: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.dragOffset = this.wrapLogoDragOffset(
      event.clientX - this.dragStartX,
      event.currentTarget as HTMLElement
    );
  }

  endLogoDrag(event: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    const target = event.currentTarget as HTMLElement;

    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  }

  showLogoTooltip(name: string): void {
    this.activeLogoName = name;
    clearTimeout(this.tooltipTimer);
    this.tooltipTimer = setTimeout(() => {
      this.activeLogoName = '';
    }, 1600);
  }

  hideLogoTooltip(): void {
    clearTimeout(this.tooltipTimer);
    this.activeLogoName = '';
  }

  private wrapLogoDragOffset(offset: number, carousel: HTMLElement): number {
    const track = carousel.querySelector<HTMLElement>('.logo-track');
    const loopWidth = track ? track.scrollWidth / 3 : 0;

    if (!loopWidth) {
      return offset;
    }

    return ((offset % loopWidth) + loopWidth) % loopWidth;
  }
}
