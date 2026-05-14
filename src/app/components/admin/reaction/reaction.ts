import { Component, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Reaction, ReactionResponse } from '../../../services/api.service';

@Component({
    selector: 'app-reaction',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './reaction.html',
    styleUrl: './reaction.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactionComponent implements OnInit {
    private apiService = inject(ApiService);
    private cdr = inject(ChangeDetectorRef);
    private router = inject(Router);
    reactions: Reaction[] = [];
    grandTotal = 0;
    grandEmailCount = 0;
    isLoading = true;
    errorMessage: string | null = null;

    ngOnInit(): void {
        this.loadReactions();
    }

    private loadReactions(): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.cdr.markForCheck();
        
        this.apiService.getReactions().subscribe({
            next: (response: any) => {
                let data = response?.length > 0 ? response[0] : {};

                if (data && data.reactions && Array.isArray(data.reactions)) {
                    // New format: { reactions: [], grandTotal: 0, ... }
                    this.reactions = data.reactions.map((r: any) => ({
                        reaction: r.reaction,
                        total: r.total ?? r.count ?? 0,
                        emailCount: r.emailCount ?? (Array.isArray(r.email) ? r.email.length : 0)
                    }));
                    this.grandTotal = data.grandTotal || 0;
                    this.grandEmailCount = data.grandEmailCount || 0;
                } else if (Array.isArray(data)) {
                    // Array format
                    this.reactions = data.map((r: any) => ({
                        reaction: r.reaction,
                        total: r.total ?? r.count ?? 0,
                        emailCount: r.emailCount ?? (Array.isArray(r.email) ? r.email.length : 0)
                    }));
                    this.grandTotal = this.reactions.reduce((acc, curr) => acc + curr.total, 0);
                    this.grandEmailCount = 0; 
                } else {
                    this.reactions = [];
                }
                
                this.sortReactions();
                
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: (error) => {
                console.error('Error loading reactions:', error);
                this.errorMessage = error.message || 'Failed to load reactions';
                this.isLoading = false;
                this.cdr.markForCheck();
            }
        });
    }

    getReactionEmoji(reaction: string): string {
        const emojiMap: { [key: string]: string } = {
            'Like': '👍',
            'Smile': '😊',
            'Appreciate': '✨',
            'Celebrate': '🎉',
            'Cheer': '👏🏻'
        };
        return emojiMap[reaction] || '👍';
    }

    private sortReactions(): void {
        const order = ['Like', 'Cheer', 'Celebrate', 'Appreciate', 'Smile'];
        this.reactions.sort((a, b) => {
            const indexA = order.indexOf(a.reaction);
            const indexB = order.indexOf(b.reaction);
            return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
        });
    }

    viewEmails(reactionType: string): void {
        this.router.navigate(['/admin/reaction', reactionType]);
    }
}
