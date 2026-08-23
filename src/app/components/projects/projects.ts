import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class ProjectsComponent {
  projects = [
    {
      num: '01',
      title: 'AI Chat CLI',
      desc: 'A command-line AI chat application powered by LLMs with real-time streaming responses. Modular architecture designed for future extension into multi-turn and multi-model conversations.',
      tech: ['Python', 'OpenAI API', 'Streaming', 'CLI'],
      githubLink: 'https://github.com/mahipalSingh08/simple-chat-cli',
      inProgress: false,
      delay: 0
    },
    {
      num: '02',
      title: 'AI Chat Application',
      desc: 'Designed and developed a modern AI chatbot FullStack application using Angular, FastAPI, and OpenAI integration, focusing on real-time communication, scalable backend APIs, and an intuitive user-friendly interface.',
      tech: ['Angular', 'Python', 'FastAPI', 'OpenAI'],
      githubLink: 'https://github.com/mahipalSingh08/angular-openai-chat',
      inProgress: false,
      delay: 200
    },
    {
      num: '03',
      title: 'RAG System',
      desc: 'A full Retrieval-Augmented Generation pipeline — from document ingestion and chunk indexing to embedding-based similarity search and context-aware LLM response generation.',
      tech: ['Python', 'Angular', 'Qdrant', 'Embeddings', 'OpenAI'],
      githubLink: 'https://github.com/mahipalSingh08/rag-document-chat',
      inProgress: false,
      delay: 100
    },
    {
      num: '04',
      title: 'AI Resume Analyzer',
      desc: 'Built an AI-driven resume evaluation tool that analyzes resumes against job descriptions — generating an ATS compatibility score, identifying keyword and skill gaps, and providing actionable rewrite suggestions to improve match quality.',
      tech: ['Python', 'OpenAI', 'Angular', 'FastAPI'],
      githubLink: '',
      inProgress: true,
      delay: 200
    }
  ];
}
