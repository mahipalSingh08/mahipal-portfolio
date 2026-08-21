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
      link: 'https://www.coursera.org/account/accomplishments/professional-cert/4ORNMRT6FW2M',
      icon: '✨',
      title: 'IBM RAG and Agentic AI',
      sub: 'AI Workflows · RAG · Agentic systems',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 0
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/5QP8ODHFOZXQ',
      icon: '🧠',
      title: 'Agentic AI Systems',
      sub: 'LangGraph · CrewAI · MCP · BeeAI',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 80
    },
    {
      link: 'https://www.udemy.com/certificate/UC-6235febc-c7ba-4341-a231-738ba239c5e3/',
      icon: '🤖',
      title: 'Agentic AI Systems',
      sub: 'LangGraph · CrewAI · MCP',
      logo: 'assets/udemy.png',
      alt: 'Udemy',
      delay: 160
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
      delay: 0
    },
    {
      link: 'https://verify.skilljar.com/c/jncgki62poe3',
      icon: '💻',
      title: 'Claude Code in Action',
      sub: 'Claude · AI Workflows',
      logo: 'assets/anthropic.png',
      alt: 'Anthropic',
      delay: 80
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/A974NUJ7AS7K',
      icon: '💡',
      title: 'Develop GenAI Apps',
      sub: 'GenAI · Prompt Engineering · AI Workflows',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 160
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/19G9J1QQLLI5',
      icon: '🏗️',
      title: 'Build RAG Applications',
      sub: 'RAG · Vector Databases · Embeddings',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 0
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/M87ZMU5VKEZI',
      icon: '🗄️',
      title: 'Vector DBs for RAG',
      sub: 'RAG · Vector Databases · Embeddings',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 80
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/EU9NPSHKBWMT',
      icon: '🔍',
      title: 'Advanced RAG & Retrievers',
      sub: 'RAG · Vector DBs · Retrievers',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 160
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/8TI8CERFHNNY',
      icon: '🖼️',
      title: 'Multimodal GenAI Apps',
      sub: 'Multimodal Prompts · AI Integrations · Web App',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 0
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/9LYIE6F0AEDE',
      icon: '⚙️',
      title: 'Building AI Agents',
      sub: 'LangChain · Tool Calling · Agentic Workflows',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 80
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/WRGY0JV81KJF',
      icon: '🔌',
      title: 'AI Agents using MCP',
      sub: 'Orchestration · MCP · Agentic systems',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 160
    },
    {
      link: 'https://www.coursera.org/account/accomplishments/verify/ARX981HQS70S',
      icon: '🎓',
      title: 'RAG & Agentic AI Capstone',
      sub: 'Multimodal Prompts · RAG · Agentic systems',
      logo: 'assets/ibm.png',
      alt: 'IBM',
      delay: 0
    }
  ];

  selectedProviders: string[] = [];
  showAll: boolean = false;

  get providers(): string[] {
    return Array.from(new Set(this.certificates.map(c => c.alt)));
  }

  get filteredCertificates(): Certificate[] {
    if (this.selectedProviders.length === 0) {
      return this.certificates;
    }
    return this.certificates.filter(c => this.selectedProviders.includes(c.alt));
  }

  get displayedCertificates(): Certificate[] {
    return this.showAll ? this.filteredCertificates : this.filteredCertificates.slice(0, 6);
  }

  get hasMoreCertificates(): boolean {
    return this.filteredCertificates.length > 6;
  }

  toggleProvider(provider: string) {
    const index = this.selectedProviders.indexOf(provider);
    if (index > -1) {
      this.selectedProviders.splice(index, 1);
    } else {
      this.selectedProviders.push(provider);
    }
    this.showAll = false; // Reset to 6 items when changing filters
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }
}
