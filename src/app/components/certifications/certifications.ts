import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

export interface Certificate {
  link: string;
  icon: string;
  title: string;
  sub: string;
  logo: string;
  alt: string;
  delay: number;
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './certifications.html',
  styleUrl: './certifications.css'
})
export class CertificationsComponent {
  certificates: Certificate[] = [
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/5QP8ODHFOZXQ',
      icon: '🧠',
      title: 'Agentic AI Systems',
      sub: 'LangGraph · CrewAI · MCP · BeeAI',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 0
    },
    {
      link: 'https://www.udemy.com/certificate/UC-6235febc-c7ba-4341-a231-738ba239c5e3/',
      icon: '🤖',
      title: 'Agentic AI Systems',
      sub: 'LangGraph · CrewAI · MCP',
      logo: 'assets/udemy.png',
      alt: 'Udemy',
      delay: 0
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/MC7MJ16P62AV',
      icon: '🔗',
      title: 'Agentic AI Systems',
      sub: 'LangChain · LangGraph',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 0
    },
    {
      link: 'https://www.udemy.com/certificate/UC-1e782f4e-0c68-4410-9488-789ec8d922e1/',
      icon: '🧬',
      title: 'Full Stack Generative & Agentic AI',
      sub: 'Python · GenAI · Production Systems',
      logo: 'assets/udemy.png',
      alt: 'Udemy',
      delay: 80
    },
    {
      link: 'https://verify.skilljar.com/c/uqm8e6cqadhn',
      icon: '⚡',
      title: 'Claude API & AI Foundations',
      sub: 'Anthropic · Prompt Engineering',
      logo: 'assets/anthropic.png',
      alt: 'Anthropic',
      delay: 160
    },
    {
      link: 'https://verify.skilljar.com/c/yta8599e8jd2',
      icon: '🔌',
      title: 'Model Context Protocol (MCP)',
      sub: 'Tool Use · Agent Integration',
      logo: 'assets/anthropic.png',
      alt: 'Anthropic',
      delay: 240
    }
  ];

  selectedProviders: string[] = [];

  get providers(): string[] {
    return Array.from(new Set(this.certificates.map(c => c.alt)));
  }

  get filteredCertificates(): Certificate[] {
    if (this.selectedProviders.length === 0) {
      return this.certificates;
    }
    return this.certificates.filter(c => this.selectedProviders.includes(c.alt));
  }

  toggleProvider(provider: string) {
    const index = this.selectedProviders.indexOf(provider);
    if (index > -1) {
      this.selectedProviders.splice(index, 1);
    } else {
      this.selectedProviders.push(provider);
    }
  }
}
